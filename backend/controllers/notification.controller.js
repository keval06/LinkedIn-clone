import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    let notification = await Notification.find({ receiver: req.userId })
      .populate("relatedUser", "firstName lastName profileImage")
      .populate("relatedPost", "image description");

    return res.status(200).json(notification);
  } catch (error) {
    return res.status(500).json({ msg: "getNotification error" + error });
  }
};

//delete one
export const deleteNotification = async (req, res) => {
  try {
    let { id } = req.params;
    await Notification.findOneAndDelete({
      _id: id,
      receiver: req.userId,
    });

    return res.status(200).json({
      message: "Notification deleted",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "deleteNotification error" + error });
  }
};

//delete many, all
export const clearAllNotification = async (req, res) => {
  try {
    await Notification.deleteMany({
      receiver:req.userId,
    })

    return res.status(200).json({
      message: "Notification deleted",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "delete all Notification error" + error });
  }
};
