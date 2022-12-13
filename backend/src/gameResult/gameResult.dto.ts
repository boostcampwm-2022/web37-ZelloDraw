export class PlayedUserAndGameCnt {
    playedUserCnt: number;
    playedGameCnt: number;
}

export class HourlySnapShotRequest {
    userCnt: number;
    gameCnt: number;
    date: Date;

    constructor(userCnt: number, gameCnt: number, date: Date) {
        this.userCnt = userCnt;
        this.gameCnt = gameCnt;
        this.date = date;
    }
}
