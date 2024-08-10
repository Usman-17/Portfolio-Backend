import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
// import End

// PATH     : /api/user/"
// METHOD   : POST
// ACCESS   : PRIVATE
// DESC     : Get User
export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUser", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/user/"
// METHOD   : POST
// ACCESS   : PRIVATE
// DESC     : Get User
export const getUserForPortfolio = async (req, res) => {
  const id = "6693ca76f797dc52d081e7d7";
  try {
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserForPortfolio", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/user/update-profile"
// METHOD   : POST
// ACCESS   : PRIVATE
// DESC     : update User
export const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      mobile,
      aboutMe,
      githubURL,
      instagramURL,
      facebookURL,
      linkedInURL,
    } = req.body;

    const user = await User.findById(req.user.id).select("-role");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (fullName) user.fullName = fullName;
    if (mobile) user.mobile = mobile;
    if (aboutMe) user.aboutMe = aboutMe;
    if (githubURL !== undefined)
      user.githubURL = githubURL === "" ? null : githubURL;
    if (instagramURL !== undefined)
      user.instagramURL = instagramURL === "" ? null : instagramURL;
    if (facebookURL !== undefined)
      user.facebookURL = facebookURL === "" ? null : facebookURL;
    if (linkedInURL !== undefined)
      user.linkedInURL = linkedInURL === "" ? null : linkedInURL;

    // Handle profile image upload
    if (req.files && req.files.profileImg) {
      if (user.profileImg && user.profileImg.public_id) {
        await cloudinary.uploader.destroy(user.profileImg.public_id);
      }

      // Upload new profile image to Cloudinary
      const profileImgResponse = await cloudinary.uploader.upload(
        req.files.profileImg.tempFilePath,
        { folder: "PROFILE_IMAGES" }
      );

      user.profileImg = {
        public_id: profileImgResponse.public_id,
        url: profileImgResponse.secure_url,
      };
    }

    // Handle resume upload
    if (req.files && req.files.resumeImg) {
      if (user.resumeImg && user.resumeImg.public_id) {
        await cloudinary.uploader.destroy(user.resumeImg.public_id);
      }

      // Upload new resume to Cloudinary
      const resumeRespone = await cloudinary.uploader.upload(
        req.files.resumeImg.tempFilePath,
        { folder: "RESUME" }
      );

      user.resumeImg = {
        public_id: resumeRespone.public_id,
        url: resumeRespone.secure_url,
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error in updateProfile:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PATH     : /api/user/update-password"
// METHOD   : POST
// ACCESS   : PRIVATE
// DESC     : update User
export const updateUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findById(req.user.id).select("password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordMatched = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordMatched) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "New password must be at least 6 characters long" });
    }

    if (newPassword !== confirmNewPassword) {
      return res
        .status(400)
        .json({ error: "New password and confirm password do not match" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error in updateUserPassword:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PATH     : /api/user/forgot-password
// METHOD   : POST
// ACCESS   : Private
// DESC     : Forgot Password Token
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Validate input
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate and save password reset token
    const token = await user.createPasswordResetToken();
    await user.save();

    const resetURL = `Hi ${user.fullName},<br><br>Please follow this link to reset your password. This link is valid for 10 minutes from now: <br> <br> <a href="${process.env.DASHBOARD_URL}reset-password/${token}">Reset Password</a>`;

    const emailData = {
      to: email,
      subject: "Portflio Dashboard Recovery Password",
      text: `Hi ${user.fullName}, please follow this link to reset your password.`,
      html: resetURL,
    };

    await sendEmail(emailData);

    res.status(200).json({
      success: true,
      message: `Password reset email sent to ${user.email}. Check your inbox.`,
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/user/reset-password/token
// METHOD   : POST
// ACCESS   : Private
// DESC     : Update Password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: "New password must be at least 6 characters long.",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Token expired or invalid, please try again." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password reset successful. You can now log in with your new password.",
      user,
    });
  } catch (error) {
    console.error("Error in resetPassword:", error.message);
    res.status(500).json({ error: error.message });
  }
};
