export type DeckTypes = 'fire' | 'water' | 'grass' | 'electro' | 'dark' | 'psycho' | 'fight';
export type Players = 'Patryk' | 'Blazej' | 'Lukasz' | 'Hana' | 'Mateusz' | 'Bartek';
export interface Details {
	result: 'x' | 'win' | 'lose' | 'draw';
	details: {
		defeated: number;
		lost: number;
	};
}

export type TournamentStats = Record<Players, PlayerStats | undefined>;

export interface PlayerStats {
	wins: number;
	loses: number;
	draws: number;
	deckType: DeckTypes[];
	pokemonsDefeated: number;
	pokemonsLost: number;
	detailsResults: Record<Players, Details>;
}

export interface TournamentDetails {
	playerId: string;
	wins: number;
	loses: number;
	draws: number;
	prizeCardsGained: number;
	prizeCardsLost: number;
	results: TournamentsDetailsResults[];
}

export interface TournamentDTO {
	_id: string;
	tournamentCount: number;
	details: TournamentDetails[];
}

export interface TournamentsDetailsResults {
	opponentId: string;
	result: string;
	prizeCardsGained: number;
	prizeCardsLost: number;
}

export interface TournamentsDetailsDTO {
	tournamentId: string;
	results: TournamentsDetailsResults[];
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

export const database: Record<string, TournamentStats> = {
	first: {
		Patryk: {
			wins: 2,
			loses: 1,
			draws: 1,
			deckType: ['water'],
			pokemonsDefeated: 21,
			pokemonsLost: 17,
			detailsResults: {
				Mateusz: {
					result: 'x',
					details: {
						defeated: 0,
						lost: 0
					}
				},
				Bartek: {
					result: 'draw',
					details: {
						defeated: 6,
						lost: 6
					}
				},
				Blazej: {
					result: 'win',
					details: {
						defeated: 6,
						lost: 3
					}
				},
				Hana: {
					result: 'lose',
					details: {
						defeated: 3,
						lost: 6
					}
				},
				Patryk: {
					result: 'x',
					details: {
						defeated: 0,
						lost: 0
					}
				},
				Lukasz: {
					result: 'win',
					details: {
						defeated: 6,
						lost: 2
					}
				}
			}
		},
		Bartek: {
			wins: 1,
			loses: 2,
			draws: 1,
			deckType: ['electro'],
			pokemonsDefeated: 17,
			pokemonsLost: 20,
			detailsResults: {
				Mateusz: {
					result: 'x',
					details: {
						defeated: 0,
						lost: 0
					}
				},
				Bartek: {
					result: 'x',
					details: {
						defeated: 0,
						lost: 0
					}
				},
				Blazej: {
					result: 'lose',
					details: {
						defeated: 3,
						lost: 6
					}
				},
				Hana: {
					result: 'win',
					details: {
						defeated: 6,
						lost: 2
					}
				},
				Patryk: {
					result: 'draw',
					details: {
						defeated: 6,
						lost: 6
					}
				},
				Lukasz: {
					result: 'lose',
					details: {
						defeated: 2,
						lost: 6
					}
				}
			}
		},
		Blazej: {
			wins: 1,
			loses: 3,
			draws: 0,
			deckType: ['dark'],
			pokemonsDefeated: 13,
			pokemonsLost: 21,
			detailsResults: {
				Mateusz: {
					result: 'x',
					details: {
						defeated: 0,
						lost: 0
					}
				},
				Bartek: {
					result: 'win',
					details: {
						defeated: 6,
						lost: 3
					}
				},
				Blazej: {
					result: 'x',
					details: {
						defeated: 0,
						lost: 0
					}
				},
				Hana: {
					result: 'lose',
					details: {
						defeated: 4,
						lost: 6
					}
				},
				Patryk: {
					result: 'lose',
					details: {
						defeated: 3,
						lost: 6
					}
				},
				Lukasz: {
					result: 'lose',
					details: {
						defeated: 0,
						lost: 6
					}
				}
			}
		},
		Hana: {
			wins: 2,
			loses: 2,
			draws: 0,
			deckType: ['grass'],
			pokemonsDefeated: 16,
			pokemonsLost: 19,
			detailsResults: {
				Mateusz: {
					result: 'x',
					details: {
						defeated: 0,
						lost: 0
					}
				},
				Bartek: {
					result: 'lose',
					details: {
						defeated: 2,
						lost: 6
					}
				},
				Blazej: {
					result: 'win',
					details: {
						defeated: 6,
						lost: 4
					}
				},
				Hana: {
					result: 'x',
					details: {
						defeated: 0,
						lost: 0
					}
				},
				Patryk: {
					result: 'win',
					details: {
						defeated: 6,
						lost: 3
					}
				},
				Lukasz: {
					result: 'lose',
					details: {
						defeated: 2,
						lost: 6
					}
				}
			}
		},
		Lukasz: {
			wins: 3,
			loses: 1,
			draws: 0,
			deckType: ['fight'],
			pokemonsDefeated: 20,
			pokemonsLost: 10,
			detailsResults: {
				Mateusz: {
					result: 'x',
					details: {
						defeated: 0,
						lost: 0
					}
				},
				Bartek: {
					result: 'win',
					details: {
						defeated: 6,
						lost: 2
					}
				},
				Blazej: {
					result: 'win',
					details: {
						defeated: 6,
						lost: 0
					}
				},
				Hana: {
					result: 'win',
					details: {
						defeated: 6,
						lost: 2
					}
				},
				Patryk: {
					result: 'lose',
					details: {
						defeated: 2,
						lost: 6
					}
				},
				Lukasz: {
					result: 'x',
					details: {
						defeated: 0,
						lost: 0
					}
				}
			}
		},
		Mateusz: undefined
	},
	second: {
		Patryk: {
			wins: 3,
			loses: 2,
			draws: 0,
			deckType: ['water'],
			pokemonsDefeated: 23,
			pokemonsLost: 23,
			detailsResults: {
				Mateusz: {
					result: 'win',
					details: {
						defeated: 6,
						lost: 4
					}
				},
				Bartek: {
					result: 'lose',
					details: {
						defeated: 1,
						lost: 6
					}
				},
				Blazej: {
					result: 'win',
					details: {
						defeated: 6,
						lost: 3
					}
				},
				Hana: {
					result: 'win',
					details: {
						defeated: 6,
						lost: 4
					}
				},
				Patryk: {
					result: 'x',
					details: {
						defeated: 0,
						lost: 0
					}
				},
				Lukasz: {
					result: 'lose',
					details: {
						defeated: 4,
						lost: 6
					}
				}
			}
		},
		Bartek: {
			wins: 2,
			loses: 3,
			draws: 0,
			deckType: ['electro'],
			pokemonsDefeated: 21,
			pokemonsLost: 24,
			detailsResults: {
				Mateusz: {
					result: 'win',
					details: {
						defeated: 6,
						lost: 5
					}
				},
				Bartek: {
					result: 'x',
					details: {
						defeated: 0,
						lost: 0
					}
				},
				Blazej: {
					result: 'lose',
					details: {
						defeated: 2,
						lost: 6
					}
				},
				Hana: {
					result: 'lose',
					details: {
						defeated: 2,
						lost: 6
					}
				},
				Patryk: {
					result: 'win',
					details: {
						defeated: 6,
						lost: 1
					}
				},
				Lukasz: {
					result: 'lose',
					details: {
						defeated: 5,
						lost: 6
					}
				}
			}
		},
		Blazej: {
			wins: 2,
			loses: 3,
			draws: 0,
			deckType: ['dark'],
			pokemonsDefeated: 18,
			pokemonsLost: 21,
			detailsResults: {
				Mateusz: {
					result: 'win',
					details: {
						defeated: 6,
						lost: 1
					}
				},
				Bartek: {
					result: 'win',
					details: {
						defeated: 6,
						lost: 2
					}
				},
				Blazej: {
					result: 'x',
					details: {
						defeated: 0,
						lost: 0
					}
				},
				Hana: {
					result: 'lose',
					details: {
						defeated: 3,
						lost: 6
					}
				},
				Patryk: {
					result: 'lose',
					details: {
						defeated: 3,
						lost: 6
					}
				},
				Lukasz: {
					result: 'lose',
					details: {
						defeated: 0,
						lost: 6
					}
				}
			}
		},
		Hana: {
			wins: 3,
			loses: 2,
			draws: 0,
			deckType: ['grass'],
			pokemonsDefeated: 22,
			pokemonsLost: 18,
			detailsResults: {
				Mateusz: {
					result: 'win',
					details: {
						defeated: 6,
						lost: 0
					}
				},
				Bartek: {
					result: 'win',
					details: {
						defeated: 6,
						lost: 2
					}
				},
				Blazej: {
					result: 'win',
					details: {
						defeated: 6,
						lost: 3
					}
				},
				Hana: {
					result: 'x',
					details: {
						defeated: 0,
						lost: 0
					}
				},
				Patryk: {
					result: 'lose',
					details: {
						defeated: 4,
						lost: 6
					}
				},
				Lukasz: {
					result: 'lose',
					details: {
						defeated: 0,
						lost: 6
					}
				}
			}
		},
		Lukasz: {
			wins: 5,
			loses: 0,
			draws: 0,
			deckType: ['grass'],
			pokemonsDefeated: 30,
			pokemonsLost: 10,
			detailsResults: {
				Mateusz: {
					result: 'win',
					details: {
						defeated: 6,
						lost: 1
					}
				},
				Bartek: {
					result: 'win',
					details: {
						defeated: 6,
						lost: 5
					}
				},
				Blazej: {
					result: 'win',
					details: {
						defeated: 6,
						lost: 0
					}
				},
				Hana: {
					result: 'win',
					details: {
						defeated: 6,
						lost: 0
					}
				},
				Patryk: {
					result: 'win',
					details: {
						defeated: 6,
						lost: 4
					}
				},
				Lukasz: {
					result: 'x',
					details: {
						defeated: 0,
						lost: 0
					}
				}
			}
		},
		Mateusz: {
			wins: 0,
			loses: 5,
			draws: 0,
			deckType: ['grass', 'water'],
			pokemonsDefeated: 11,
			pokemonsLost: 30,
			detailsResults: {
				Mateusz: {
					result: 'x',
					details: {
						defeated: 0,
						lost: 0
					}
				},
				Bartek: {
					result: 'lose',
					details: {
						defeated: 5,
						lost: 6
					}
				},
				Blazej: {
					result: 'lose',
					details: {
						defeated: 1,
						lost: 6
					}
				},
				Hana: {
					result: 'lose',
					details: {
						defeated: 0,
						lost: 6
					}
				},
				Patryk: {
					result: 'lose',
					details: {
						defeated: 4,
						lost: 6
					}
				},
				Lukasz: {
					result: 'lose',
					details: {
						defeated: 1,
						lost: 6
					}
				}
			}
		}
	}
};
