export const createAccumulatedStatContext = (playedUserCnt: number, playedGameCnt: number) => {
    return {
        block_id: '1d508a03704e49789f4eb081487ddc11',
        callout: {
            icon: {
                emoji: '🎮',
            },
            rich_text: [
                {
                    type: 'text',
                    text: {
                        content: `누적 진행 게임 수: ${playedGameCnt}개\n`,
                    },
                },
                {
                    type: 'text',
                    text: {
                        content: `누적 참여 유저 수: ${playedUserCnt}명`,
                    },
                },
            ],
        },
    };
};

export const createCurrentStatContext = (userCnt: number, gameCnt: number) => {
    return {
        block_id: '60f1d7f83b3d4dd9957c3e4b07d1efbd',
        callout: {
            icon: {
                emoji: '🖍',
            },
            rich_text: [
                {
                    type: 'text',
                    text: {
                        content: `진행중인 게임 수: ${gameCnt}개\n`,
                    },
                },
                {
                    type: 'text',
                    text: {
                        content: `게임중인 유저 수: ${userCnt}명`,
                    },
                },
            ],
        },
    };
};

export const setHourlyStatContext = (userCnt: number, gameCnt: number) => {
    return {
        parent: { database_id: '789ac60c6f814d3dbef705f9ea310297' },
        properties: {
            '접속자 수(최대)': {
                type: 'title',
                title: [
                    {
                        type: 'text',
                        text: {
                            content: userCnt.toString(),
                        },
                    },
                ],
            },
            '게임 진행 수': {
                type: 'rich_text',
                rich_text: [
                    {
                        type: 'text',
                        text: {
                            content: gameCnt.toString(),
                        },
                    },
                ],
            },
            일시: {
                type: 'date',
                date: {
                    start: new Date().toISOString(),
                },
            },
        },
    };
};
