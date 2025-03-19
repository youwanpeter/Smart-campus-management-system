const express = require("express");
const router = express.Router();
const Resource = require("../models/resource.js");
const ResourceReview = require("../models/resourceReview.js");
const Users = require("../models/Users.js");

//Generate ID with 01, 02, 03 precedence format
const generateId = async () => {
  try {
    //Only consider approved resources when generating IDs
    const resources = await Resource.find({ status: "Approved" }).sort({ id: 1 });
    let newId = resources.length > 0 ? parseInt(resources[resources.length - 1].id) + 1 : 1;
    return newId.toString().padStart(2, "0");
  } catch (error) {
    console.error("Error generating ID:", error);
    return Math.floor(Math.random() * 1000).toString().padStart(2, "0");
  }
};

//Get all resources
router.get("/", async (req, res) => {
  try {
    const resources = await Resource.find().sort({ id: 1 });
    console.log(`Fetched ${resources.length} resources`);
    res.json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ message: "Error fetching resources" });
  }
});

//Get all pending reviews
router.get("/pending", async (req, res) => {
  try {
    const pendingReviews = await ResourceReview.find({ status: "Pending" });
    console.log(`Fetched ${pendingReviews.length} pending reviews`);

    const enhancedReviews = await Promise.all(
      pendingReviews.map(async (review) => {
        const user = await Users.findOne({ username: review.requested_by });
        return {
          ...review.toObject(),
          requested_by_name: user ? user.name : "Unknown",
        };
      })
    );

    res.json(enhancedReviews);
  } catch (error) {
    console.error("Error fetching pending reviews:", error);
    res.status(500).json({ message: "Error fetching pending reviews" });
  }
});

//Direct resource operations (admin only)
router.post("/", async (req, res) => {
  try {
    const newId = await generateId();
    console.log(`Generated new ID: ${newId} for direct resource addition`);

    const newResource = new Resource({
      id: newId,
      ...req.body,
      status: "Approved",
    });

    await newResource.save();
    console.log(`Direct resource added with ID: ${newId}`);
    res.json(newResource);
  } catch (error) {
    console.error("Error adding resource:", error);
    res.status(500).json({ message: "Error adding resource" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    console.log(`Updating resource with ID: ${req.params.id}`);
    const updatedResource = await Resource.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body, status: "Approved" },
      { new: true }
    );

    if (!updatedResource) {
      console.warn(`Resource not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: "Resource not found" });
    }

    console.log(`Resource updated successfully with ID: ${req.params.id}`);
    res.json(updatedResource);
  } catch (error) {
    console.error("Error updating resource:", error);
    res.status(500).json({ message: "Error updating resource" });
  }
});

//Delete a resource (admin)
router.delete("/:id", async (req, res) => {
  try {
    console.log(`Deleting resource with ID: ${req.params.id}`);
    const result = await Resource.findOneAndDelete({ id: req.params.id });

    if (!result) {
      console.warn(`Resource not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: "Resource not found" });
    }

    console.log(`Resource deleted successfully with ID: ${req.params.id}`);
    res.json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Error deleting resource:", error);
    res.status(500).json({ message: "Error deleting resource" });
  }
});

//Submit a resource review request (lecturer)
router.post("/review", async (req, res) => {
  try {
    console.log("Received review request:", req.body);

    //Validate required fields
    if (!req.body.requested_by || req.body.requested_by.trim() === "") {
      console.warn("Invalid review request: Missing requested_by field");
      return res.status(400).json({ message: "requested_by is required and cannot be empty" });
    }

    const reviewRequest = new ResourceReview({
      ...req.body,
      created_at: new Date(),
      status: "Pending"
    });

    await reviewRequest.save();
    console.log(`Review request saved with ID: ${reviewRequest._id}`);

    // If this is an add request, create a pending resource
    if (req.body.action_type === "add") {
      const tempId = await generateId();
      console.log(`Generated temporary ID: ${tempId} for pending resource`);

      const newResource = new Resource({
        id: tempId,
        resource_name: req.body.resource_name,
        acquired_date: req.body.acquired_date,
        return_date: req.body.return_date,
        acquired_person: req.body.acquired_person,
        resource_dep: req.body.resource_dep,
        resource_purpose: req.body.resource_purpose,
        resource_status: req.body.resource_status,
        resource_remarks: req.body.resource_remarks,
        status: "Pending",
        requested_by: req.body.requested_by,
      });

      await newResource.save();
      console.log(`Pending resource created with temporary ID: ${tempId}`);

      // Update the review with the resource ID
      reviewRequest.id = tempId;
      await reviewRequest.save();
      console.log(`Review request updated with resource ID: ${tempId}`);
    }

    res.json(reviewRequest);
  } catch (error) {
    console.error("Error submitting review request:", error);
    res.status(500).json({ message: "Error submitting review request" });
  }
});

//Approve a review
router.put("/review/:id/approve", async (req, res) => {
  try {
    console.log(`Approving review with ID: ${req.params.id}`);
    const review = await ResourceReview.findById(req.params.id);

    if (!review) {
      console.warn(`Review not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: "Review not found" });
    }

    // Update review status
    review.status = "Approved";
    review.processed_at = new Date();
    await review.save();
    console.log(`Review status updated to Approved for ID: ${req.params.id}`);

    if (review.action_type === "add") {
      console.log(`Processing ADD action for review ID: ${req.params.id}`);

      // Check if the ID exists and is in a valid format
      if (review.id && /^\d+$/.test(review.id)) {
        // Find the resource using the properly formatted ID
        const pendingResource = await Resource.findOne({ id: review.id });
        
        if (!pendingResource) {
          console.warn(`No resource found with id: ${review.id}`);
          
          // Instead of returning an error, create a new resource
          const newId = await generateId();
          const newResource = new Resource({
            id: newId,
            resource_name: review.resource_name,
            acquired_date: review.acquired_date,
            return_date: review.return_date,
            acquired_person: review.acquired_person,
            resource_dep: review.resource_dep,
            resource_purpose: review.resource_purpose,
            resource_status: review.resource_status,
            resource_remarks: review.resource_remarks,
            status: "Approved",
            requested_by: review.requested_by,
          });

          await newResource.save();
          console.log(`Created new approved resource with ID: ${newId}`);
          return res.json({ message: "Review approved and new resource created" });
        }

        // Update the resource status to "Approved"
        pendingResource.status = "Approved";
        const updatedResource = await pendingResource.save();
        console.log(`Updated resource status to Approved, ID: ${updatedResource.id}`);
      } else {
        // No valid pending resource ID, create a new one
        const newId = await generateId();
        const newResource = new Resource({
          id: newId,
          resource_name: review.resource_name,
          acquired_date: review.acquired_date,
          return_date: review.return_date,
          acquired_person: review.acquired_person,
          resource_dep: review.resource_dep,
          resource_purpose: review.resource_purpose,
          resource_status: review.resource_status,
          resource_remarks: review.resource_remarks,
          status: "Approved",
          requested_by: review.requested_by,
        });

        await newResource.save();
        console.log(`Created new approved resource with ID: ${newId}`);
      }
    }
    
    // Rest of the function remains the same...
    
    res.json({ message: "Review approved successfully" });
  } catch (error) {
    console.error("Error approving review:", error);
    res.status(500).json({ message: "Error approving review" });
  }
});

//Reject a review
router.put("/review/:id/reject", async (req, res) => {
  try {
    console.log(`Rejecting review with ID: ${req.params.id}`);
    const review = await ResourceReview.findById(req.params.id);

    if (!review) {
      console.warn(`Review not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: "Review not found" });
    }

    review.status = "Rejected";
    review.processed_at = new Date();
    await review.save();
    console.log(`Review status updated to Rejected for ID: ${req.params.id}`);

    //If this was an add request with a pending resource, remove it
    if (review.action_type === "add" && review.id) {
      console.log(`Removing pending resource with ID: ${review.id}`);
      const deletedResource = await Resource.findOneAndDelete({
        id: review.id,
        status: "Pending",
      });

      if (!deletedResource) {
        console.warn(`No pending resource found to delete with id: ${review.id}`);
      } else {
        console.log(`Pending resource deleted successfully, ID: ${review.id}`);
      }
    }

    res.json({ message: "Review rejected successfully" });
  } catch (error) {
    console.error("Error rejecting review:", error);
    res.status(500).json({ message: "Error rejecting review" });
  }
});

module.exports = router;