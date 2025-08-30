import { Op } from "sequelize";
import User from "../database/models/user";

export const duplicationCheckMiddleware =
  (model, type: "create" | "update", idField?: string) =>
  async (req, res, next) => {
    try {
      const {
        mobileNumber,
        optionalNumber,
        email,
        aadhaarNumber,
        userId,
        gstOrCertificateNumber,
      } = req.body;
      const entityId = req.params[idField];

      if (type === "create") {
        //  1. check for valid userId.

        const user = await User.findByPk(userId);

        if (!user) return res.status(400).json({ message: "User not found." });

        // 2. check for consistent mobile number during onboarding and verification.

        if (mobileNumber && mobileNumber !== user.mobile)
          return res.status(400).json({
            message:
              "Mobile number entered is not same as verified by the user.",
          });

        if (optionalNumber && optionalNumber !== user.mobile)
          return res.status(400).json({
            message:
              "Mobile number entered is not same as verified by the user.",
          });

        // 3. check for duplicate entry in tables for same userId.

        const existingData = await model.count({
          where: { userId },
        });

        if (existingData) {
          return res.status(400).json({
            message: `${model.name} already registered for this user.`,
          });
        }

        // 4.  optional check for duplicate mobile number entry among different users.

        if (mobileNumber || optionalNumber) {
          const isDuplicateMobile = await model.count({
            where: {
              [Op.or]: [
                mobileNumber ? { mobileNumber } : {},
                optionalNumber ? { optionalNumber } : {},
              ],
            },
          });

          if (isDuplicateMobile) {
            return res.status(400).json({
              message: "Mobile Number is already in use for other user.",
            });
          }
        }
        // 5. check for duplicate gst certificate number.

        if (gstOrCertificateNumber) {
          const isDuplicateGstCertificate = await model.count({
            where: { gstOrCertificateNumber },
          });

          if (isDuplicateGstCertificate) {
            return res.status(400).json({
              message:
                "Gst Certificate Number is already in use for other user.",
            });
          }
        }

        // 6. check for unique email.

        if (email) {
          const isDuplicateEmail = await model.count({
            where: { email },
          });

          if (isDuplicateEmail) {
            return res.status(400).json({
              message: "Email is already in use for other user.",
            });
          }
        }

        // 7. check for duplicate aadharNumber

        if (aadhaarNumber) {
          const isDuplicateAadharNumber = await model.count({
            where: { aadhaarNumber },
          });

          if (isDuplicateAadharNumber) {
            return res.status(400).json({
              message: "Aadhar Number is already in use for other user.",
            });
          }
        }
      } else if (type === "update") {
        // // update checks.

        const isEntityExist = await model.findByPk(entityId);
        if (!isEntityExist)
          return res
            .status(400)
            .json({ message: `${model.name} do not exist for given id.` });

        if (mobileNumber) {
          const isDuplicateMobileNumber = await model.findOne({
            where: { mobileNumber },
          });

          if (
            isDuplicateMobileNumber &&
            isDuplicateMobileNumber.id != entityId
          ) {
            return res.status(400).json({
              message: "Mobile Number is already in use for another user.",
            });
          }
        }

        if (optionalNumber) {
          const isDuplicateMobileNumber = await model.findOne({
            where: { optionalNumber },
          });

          if (
            isDuplicateMobileNumber &&
            isDuplicateMobileNumber.id != entityId
          ) {
            return res.status(400).json({
              message: "Mobile Number is already in use for another user.",
            });
          }
        }

        if (gstOrCertificateNumber) {
          const isDuplicateGstCertificate = await model.findOne({
            where: { gstOrCertificateNumber },
          });

          if (
            isDuplicateGstCertificate &&
            isDuplicateGstCertificate.id != entityId
          ) {
            return res.status(400).json({
              message:
                "Gst Certificate Number is already in use for another user.",
            });
          }
        }

        if (email) {
          const isDuplicateEmail = await model.findOne({
            where: { email },
          });

          if (isDuplicateEmail && isDuplicateEmail.id != entityId) {
            return res.status(400).json({
              message: "Email is already in use for another user.",
            });
          }
        }

        if (aadhaarNumber) {
          const isDuplicateAadhar = await model.findOne({
            where: { aadhaarNumber },
          });

          if (isDuplicateAadhar && isDuplicateAadhar.id != entityId) {
            return res.status(400).json({
              message:
                "Aadhaar Card Number is already in use for another user.",
            });
          }
        }
      }
      next();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
