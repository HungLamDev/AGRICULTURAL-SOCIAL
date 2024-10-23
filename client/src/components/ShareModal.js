import React from "react";
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";

const ShareModal = ({ url }) => {
  return (
    <div className="d-flex justify-content-between p-4 share-modal">
      <FacebookShareButton url={url} aria-label="Share on Facebook">
        <FacebookIcon round={true} size={40} />
      </FacebookShareButton>

      <EmailShareButton url={url} aria-label="Share via Email">
        <EmailIcon round={true} size={40} />
      </EmailShareButton>

      <LinkedinShareButton url={url} aria-label="Share on LinkedIn">
        <LinkedinIcon round={true} size={40} />
      </LinkedinShareButton>

      <TelegramShareButton url={url} aria-label="Share on Telegram">
        <TelegramIcon round={true} size={40} />
      </TelegramShareButton>

      <TwitterShareButton url={url} aria-label="Share on Twitter">
        <TwitterIcon round={true} size={40} />
      </TwitterShareButton>
    </div>
  );
};

export default ShareModal;
