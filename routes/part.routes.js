import express from "express";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import isAuth from "../middlewares/isAuth.js";
import machineModel from "../model/machine.model.js";
import partModel from "../model/parts.model.js";

const partRouter = express.Router();

//criar

partRouter.post("/createPart", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const user = req.currentUser;
    const newPart = await partModel.create({
      ...req.body,
      userCreator: user._id,
    });
    await machineModel.findOneAndUpdate(
      { serialNumber: newPart.machineSerialNumber },
      {
        $push: { parts: newPart._id },
      },
      { runValidators: true }
    );
    return res.status(201).json(newPart);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ msg: "Oh Não! Algo deu errado na criação desse partNumber!" });
  }
});

// obterAll

partRouter.get("/", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const getParts = await partModel
      .find({ ...req.body })
      .populate({ path: "userCreator", select: "name" });
    return res.status(201).json(getParts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Oh Não! Algo deu errado!" });
  }
});

// buscar somente um partnumber

partRouter.get("/:partId", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const { partId } = req.params;

    const findPart = await partModel.findOne({ _id: partId });
    return res.status(200).json(findPart);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Oh Não! Algo deu errado!" });
  }
});

//EDIT

partRouter.put(
  "/edit/:partId",
  isAuth,
  attachCurrentUser,
  isAdmin,
  async (req, res) => {
    try {
      const { partId } = req.params;
      const updatePart = await partModel.findByIdAndUpdate(
        partId,
        { ...req.body },
        { runValidators: true, new: true }
      );

      return res.status(200).json(updatePart);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Oh Não! Algo deu errado!" });
    }
  }
);

// Deletar

partRouter.delete(
  "/delete/:partId",
  isAuth,
  attachCurrentUser,
  isAdmin,
  async (req, res) => {
    try {
      const { partId } = req.params;

      const deletePart = await partModel.findByIdAndDelete(partId);

      await machineModel.findOneAndUpdate(
        { parts: partId },
        { $pull: { parts: partId } }
      );

      return res.status(200).json(deletePart);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Oh Não! Algo deu errado!" });
    }
  }
);

export default partRouter;
