'use strict'

const AuthorizationService = use('App/Services/AuthorizationService');
const Project = use('App/Models/Project');

class ProjectController {
    async create({ auth, request }){
        const user = await auth.getUser();
        const title = request.all();
        const project = new Project();
        project.fill(title);
        await user.projects().save(project);
        return project;
    }

    async destroy({ auth, request, params }){
        const user = await auth.getUser();
        const { id } = params;
        const project = await Project.find(id);
        new AuthorizationService().verifyPermission(project, user);
        await project.delete();
        return project;
    }

    async index({ auth }){
        const user = await auth.getUser();
        return await user.projects().fetch();
    }

    async update({ auth, request, params }){
        const user = await auth.getUser();
        const { id } = params;
        const project = await Project.find(id);
        new AuthorizationService().verifyPermission(project, user);
        project.merge(request.only('title'));
        await project.save();
        return project;
    }
}

module.exports = ProjectController
