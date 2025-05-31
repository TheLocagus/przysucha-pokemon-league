import type { MatchesDto } from '$types';

export const getScores = (matches: MatchesDto[], playerId: string) =>
	matches.reduce(
		(score, match) => {
			const player =
				match.playerOne._id.toString() === playerId ? match.playerOne : match.playerTwo;
			const opponent =
				match.playerOne._id.toString() === playerId ? match.playerTwo : match.playerOne;

			if (player.score > opponent.score) score.wins++;
			else if (player.score < opponent.score) score.loses++;
			else score.draws++;

			score.prizeCardsGained += player.score;
			score.prizeCardsLost += opponent.score;

			return score;
		},
		{
			wins: 0,
			loses: 0,
			draws: 0,
			prizeCardsGained: 0,
			prizeCardsLost: 0
		}
	);
