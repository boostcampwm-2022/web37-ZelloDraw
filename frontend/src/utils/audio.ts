import countdownSound from '@assets/sounds/countdown.mp3';
import selectedSound from '@assets/sounds/select-tools.wav';
import pageUpSound from '@assets/sounds/page-up.wav';
import pageDownSound from '@assets/sounds/page-down.wav';
import bookMovedSound from '@assets/sounds/book-moved.wav';
import resultInSound from '@assets/sounds/result-in.wav';

const countdownAudio = new Audio(countdownSound);
export function playCountdownSound() {
    void countdownAudio.play();
}

const toolSelectedAudio = new Audio(selectedSound);
export function playSelectedSound() {
    void toolSelectedAudio.play();
}

const pageUpAudio = new Audio(pageUpSound);
export function playPageUpSound() {
    void pageUpAudio.play();
}

const pageDownAudio = new Audio(pageDownSound);
export function playPageDownSound() {
    void pageDownAudio.play();
}

const bookMovedAudio = new Audio(bookMovedSound);
export function playBookMovedSound() {
    void bookMovedAudio.play();
}

const resultInAudio = new Audio(resultInSound);
export function playResultInSound() {
    void resultInAudio.play();
}
