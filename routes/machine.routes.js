import express from "express";
import machineModel from "../model/machine.model.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";

const machineRouter = express.Router();

//create
machineRouter.post("/", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const user = req.currentUser;
    const newPart = await machineModel.create({
      ...req.body,
      userCreator: user._id,
    });

    return res.status(200).json(newPart);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Vixe! Deu ruim em criar o serial da unidade",
    });
  }
});

//get

machineRouter.get("/", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const machines = await machineModel
      .find({ ...req.body })
      .populate({ path: "userCreator", select: "name" })
      .populate({ path: "parts", select: "partNumber" });

    return res.status(201).json(machines);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Vixe! Deu ruim em obter os numeros de Serial das maquinas das peças",
    });
  }
});

//getOne

machineRouter.get(
  "/:machineId",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { machineId } = req.params;
      const findMachine = await machineModel.findById(machineId);
      return res.status(200).json(findMachine);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        msg: "Vixe! Deu ruim em obter esse serial! Ele existe mesmo? ",
      });
    }
  }
);

//delete
machineRouter.delete(
  "/delete/:machineId",
  isAuth,
  attachCurrentUser,
  isAdmin,
  async (req, res) => {
    try {
      const { machineId } = req.params;

      const deleteMachine = await machineModel.findByIdAndDelete(machineId);

      return res.status(200).json(deleteMachine);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Oh Não! Algo deu errado!" });
    }
  }
);

export default machineRouter;
