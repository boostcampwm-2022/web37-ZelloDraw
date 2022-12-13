export const createAccumulatedStatContext = (playedUserCnt: number, playedGameCnt: number) => {
    return {
        block_id: '1d508a03704e49789f4eb081487ddc11',
        callout: {
            icon: {
                emoji: '💡',
            },
            rich_text: [
                {
                    type: 'text',
                    text: {
                        content: `현재까지 플레이한 누적 인원 수: ${playedUserCnt}명\n`,
                    },
                },
                {
                    type: 'text',
                    text: {
                        content: `현재까지 진행된 게임 수: ${playedGameCnt}개`,
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
                emoji: '💡',
            },
            rich_text: [
                {
                    type: 'text',
                    text: {
                        content: `사용중인 유저 수: ${userCnt}명\n`,
                    },
                },
                {
                    type: 'text',
                    text: {
                        content: `진행중인 게임 수: ${gameCnt}개`,
                    },
                },
            ],
        },
    };
};
