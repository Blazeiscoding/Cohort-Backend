// boilerplate code
import { ProjectNote } from "../models/note.models";

const getNotes = async (req, res) => {
  // get all notes
  const note = await ProjectNote.findOne({ project: req.params.id });

  if (!note) {
    return res.status(400).json({
      message: "No notes found",
    });
  }
  return res.status(200).json({
    message: "Notes found",
    note,
  });
};

const getNoteById = async (req, res) => {
  // get note by id
  const note = await ProjectNote.findOne({ project: req.params.id });
  (await note.populate("project")).populate("createdBy", "name email");

  if (!note) {
    return res.status(404).json({ message: "note not found" });
  }
  res.status(200).json(note);
};
const createNote = async (req, res) => {
  // create note
  const note = await ProjectNote.findOne({ project: req.params.id });
  if (!note) {
    return res.status(404).json({ message: "note not found" });
  }
  note.content = req.body.content;
  await note.save();
  res.status(200).json(note);
};

const updateNote = async (req, res) => {
  // update note
  const note = await ProjectNote.findOne({ project: req.params.id });
  if (!note) {
    return res.status(404).json({ message: "note not found" });
  }
  note.content = req.body.content;
  await note.save();
  res.status(200).json(note);
};

const deleteNote = async (req, res) => {
  // delete note
  const note = await ProjectNote.findOne({ project: req.params.id });
  if (!note) {
    return res.status(404).json({ message: "note not found" });
  }
  await note.deleteOne();
  res.status(200).json(note);
};

export { createNote, deleteNote, getNoteById, getNotes, updateNote };
