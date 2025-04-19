import { ProjectMember } from "../models/projectmember.models";
import { Project } from "../models/project.models";
const getProjects = async (req, res) => {
  // get all projects
  const project = await Project.find({}).populate("createdBy");
  if (!project) {
    return res.status(400).json({
      message: "No projects found",
    });
  }
  return res.status(200).json({
    message: "Projects found",
    project,
  });
};

const getProjectById = async (req, res) => {
  // get project by id
  const project = await Project.findOne({ _id: req.params.id });
  if (!project) {
    return res.status(400).json({
      message: "No projects found",
    });
  }
  return res.status(200).json({
    message: "Project found",
    project,
  });
};

const createProject = async (req, res) => {
  // create project
  const project = await Project.create(req.body);
  if (!project) {
    return res.status(400).json({
      message: "Project not created",
    });
  }
  return res.status(200).json({
    message: "Project created",
    project,
  });
};

const updateProject = async (req, res) => {
  // update project
  const project = await Project.findOne(req.params.id);
  if (!project) {
    return res.status(400).json({
      message: "Project not found",
    });
  }
  project.name = req.body.name;
  project.description = req.body.description;
  await project.save();
  return res.status(200).json({
    message: "Project updated",
    project,
  });
};

const deleteProject = async (req, res) => {
  // delete project
  const project = await Project.findOne(req.params.id);
  if (!project) {
    return res.status(400).json({
      message: "Project not found",
    });
  }
  await project.deleteOne();
  return res.status(200).json({
    message: "Project deleted",
    project,
  });
};

const getProjectMembers = async (req, res) => {
  // get project members
  const project = await Project.findOne({ _id: req.params.id });
  if (!project) {
    return res.status(400).json({
      message: "Project not found",
    });
  }
  const members = await ProjectMember.find({ project: req.params.id });
  return res.status(200).json({
    message: "Project members found",
    members,
  });
};

const addMemberToProject = async (req, res) => {
  // add member to project
  const project = await Project.findOne({ _id: req.params.id });
  if (!project) {
    return res.status(400).json({
      message: "Project not found",
    });
  }
  const member = await ProjectMember.create(req.body);
  if (!member) {
    return res.status(400).json({
      message: "Member not added",
    });
  }
  return res.status(200).json({
    message: "Member added",
    member,
  });
};

const deleteMember = async (req, res) => {
  // delete member from project
  const project = await Project.findOne({ _id: req.params.id });
  if (!project) {
    return res.status(400).json({
      message: "Project not found",
    });
  }
  const member = await ProjectMember.findOne({ _id: req.params.id });
  if (!member) {
    return res.status(400).json({
      message: "Member not found",
    });
  }
  await member.deleteOne();
  return res.status(200).json({
    message: "Member deleted",
    member,
  });
};

const updateMemberRole = async (req, res) => {
  // update member role
  const project = await Project.findOne({ _id: req.params.id });
  if (!project) {
    return res.status(400).json({
      message: "Project not found",
    });
  }
  const member = await ProjectMember.findOne({ _id: req.params.id });
  if (!member) {
    return res.status(400).json({
      message: "Member not found",
    });
  }
  member.role = req.body.role;
  await member.save();
  return res.status(200).json({
    message: "Member role updated",
    member,
  });
};

export {
  addMemberToProject,
  createProject,
  deleteMember,
  deleteProject,
  getProjectById,
  getProjectMembers,
  getProjects,
  updateMemberRole,
  updateProject,
};
