import { AvailableResolutions } from "../enums/video.enums";
import { VideoType } from "../types/video.type";

export const videoDB : VideoType[] = [{
    "id": 0,
    "title": "string",
    "author": "string",
    "canBeDownloaded": false,
    "minAgeRestriction": null,
    "createdAt": "2023-08-14T16:17:58.175Z",
    "publicationDate": "2023-08-14T16:17:58.175Z",
    "availableResolutions": [AvailableResolutions.P144]
  }]