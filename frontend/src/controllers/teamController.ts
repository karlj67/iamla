import { TeamModel } from '../models/Team';
import type { CreateTeamData, UpdateTeamData } from '../types/business';

export const createTeam = async (teamData: CreateTeamData) => {
  return await TeamModel.create(teamData);
};

export const getTeamMembers = async (teamId: string) => {
  return await TeamModel.getMembers(teamId);
};

export const updateTeam = async (id: string, teamData: UpdateTeamData) => {
  return await TeamModel.update(id, teamData);
};
