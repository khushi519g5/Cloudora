const UserActivity = require("../models/UserActivity");

// SAVE ACTIVITY (POST /track)
exports.saveActivity = async (req, res) => {
  try {
    const { resourceId, action, category } = req.body;

    await UserActivity.create({
      resourceId,
      action,
      category,
    });

    res.json({
      success: true,
      message: "Activity saved",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET RECOMMENDATIONS (GET /recommendations)
exports.getRecommendations = async (req, res) => {
  try {
    const trending = await UserActivity.aggregate([
      // only views
      {
        $match: {
          action: "view",
        },
      },

      // count per resource
      {
        $group: {
          _id: "$resourceId",
          views: { $sum: 1 },
        },
      },

      // join Resource collection
      {
        $lookup: {
          from: "resources",
          localField: "_id",
          foreignField: "_id",
          as: "resource",
        },
      },

      // flatten
      {
        $unwind: {
          path: "$resource",
          preserveNullAndEmptyArrays: true,
        },
      },

      // final output
      {
        $project: {
          _id: 1,
          name: "$resource.title",
          views: 1,
          fileUrl: "$resource.fileUrl"
        },
      },

      // sort top views
      {
        $sort: {
          views: -1,
        },
      },

      // limit top 10
      {
        $limit: 10,
      },
    ]);

    res.json({
      success: true,
      recommendations: trending,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};