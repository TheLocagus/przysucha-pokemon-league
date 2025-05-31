import type { ObjectId } from 'mongodb';

export interface MatchesDto {
	_id: ObjectId;
	tournamentId: string;
	playerOne: {
		_id: ObjectId;
		name: string;
		score: number;
	};
	playerTwo: {
		_id: ObjectId;
		name: string;
		score: number;
	};
}

export interface PlayersStats {
	playerId: string;
	wins: number;
	loses: number;
	draws: number;
	prizeCardsGained: number;
	prizeCardsLost: number;
}

export interface TournamentDTO {
	_id: string;
	tournamentCount: number;
	players: string[];
	date: string;
	status: string;
}

export interface PlayersDTO {
	_id: string;
	name: string;
	wins: number;
	loses: number;
	draws: number;
	prizeCardsGained: number;
	prizeCardsLost: number;
	tournamentsDetails: TournamentsDetailsDTO[];
}
