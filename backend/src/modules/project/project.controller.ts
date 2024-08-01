import { Request, Response } from 'express';
import projectService from './project.service';
import { HttpStatusCode } from 'axios';
import { Controller } from '../../decorators/app.decorators';
import { parseObjectStringValuesToPrimitives } from '../../utils/object.utils';
import qs from 'qs';
import _ from 'lodash';
import { CommandType } from '../../utils/dao.utils';
import { rabbitMQ } from '../../utils/rabbitmq.utils';
import proposalService from '../proposal/proposal.service';

@Controller()
export class ProjectController {
  async findMany(request: Request, response: Response) {
    const query = request.query
      ? parseObjectStringValuesToPrimitives(
          qs.parse(request.query as Record<string, any>, { comma: true, allowDots: true }),
        )
      : undefined;

    const projects = await projectService.findMany({
      order: {
        createdAt: 'DESC',
        milestones: {
          createdAt: 'DESC',
        },
      },
      ...query,
    });

    return response.status(HttpStatusCode.Ok).json(projects);
  }

  async findOne(request: Request, response: Response) {
    const query = request.query
      ? parseObjectStringValuesToPrimitives(
          qs.parse(request.query as Record<string, any>, { comma: true, allowDots: true }),
        )
      : undefined;

    const { id } = request.params as any;
    const project = await projectService.findOne({
      order: {
        milestones: {
          createdAt: 'DESC',
        },
      },
      ..._.merge(query, { where: { id } }),
    });

    return response.status(HttpStatusCode.Ok).json(project);
  }

  async create(request: Request, response: Response) {
    const project = await projectService.create(request.body);

    return response.status(HttpStatusCode.Created).json(project);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params as any;
    await projectService.findOne({ where: { id } });
    const project = await projectService.update(id, request.body);

    return response.status(HttpStatusCode.Ok).json(project);
  }

  async remove(request: Request, response: Response) {
    const { id } = request.params as any;
    await projectService.findOne({ where: { id } });
    const project = await projectService.remove(id);

    return response.status(HttpStatusCode.Ok).json(project);
  }

  async prepareNftMetadata(request: Request, response: Response) {
    const ipfsURL = await projectService.prepareNftMetadata(request.body);

    return response.status(HttpStatusCode.Created).json({ ipfsURL });
  }
}

export default new ProjectController();
