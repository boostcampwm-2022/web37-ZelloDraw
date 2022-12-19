import gitHubIcon from '@assets/icons/github.svg';
import { zelloGitHubURL } from '@utils/constants';

function GitHubIconButton() {
    const onClickGitHubBtn = () => {
        window.open(zelloGitHubURL, '_blank');
    };

    return (
        <button onClick={onClickGitHubBtn} aria-label={'깃허브에서 젤로 드로우 보기'}>
            <img src={gitHubIcon} alt={'GitHub Icon'} />
        </button>
    );
}

export default GitHubIconButton;
