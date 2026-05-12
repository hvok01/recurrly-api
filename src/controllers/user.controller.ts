import User from "../models/user";

const createForbiddenError = (message: string) => {
  const error = new Error(message);
  return error;
};

export const getCurrentUser = async (req: any, res: any, next: any) => {
  try {
    res.status(200).json({
      success: true,
      message: "Current user fetched successfully",
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req: any, res: any, next: any) => {
  try {
    if (req.user.id !== req.params.id) {
      throw createForbiddenError("You can only access your own user record");
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      const error = new Error("User not found");
      throw error;
    }
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};