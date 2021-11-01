import axios from 'axios';
import client from './client';

import Video, { IVideoAnalysis } from '../interfaces/IVideo';
import Category from '../interfaces/ICategory';
import ApiMessage from '../interfaces/IApiMessage';
import Range from '../interfaces/IRange';

interface PatchVideoPayload {
  title: string;
  description: string;
  categories: string;
  thumbnail: File;
  privacy: 'public' | 'private';
}

interface GetVideoAnalysisParams {
  unit: 'day' | 'month' | 'year';
  from: Date | string;
}

class VideoApi {
  public getVideos(range?: Range, category?: string): Promise<Video[]> {
    return client.get('/videos/', { params: { ...range, category, sort: 'newest' } });
  }

  public getSubscriptionVideos(range?: Range): Promise<Video[]> {
    return client.get('/videos/subscription', { params: range });
  }

  public getRelateVideos(id: string, range?: Range): Promise<Video[]> {
    return client.get(`/videos/${id}/relate`, { params: range });
  }

  public getLikedVideos(range?: Range): Promise<Video[]> {
    return client.get(`/videos/liked`, { params: range });
  }

  public getVideo(id: string, isWatch?: boolean): Promise<Video> {
    return client.get('/videos/' + id, {
      params: { is_watch: isWatch ? '1' : undefined },
    });
  }

  public reactVideo(id: string, isLike: boolean): Promise<ApiMessage> {
    return client.post(`/videos/${id}/reaction`, {
      reaction: isLike ? 'like' : 'dislike',
    });
  }

  public removeVideoReaction(id: string): Promise<ApiMessage> {
    return client.delete(`/videos/${id}/reaction`);
  }

  public removeVideo(id: string): Promise<ApiMessage> {
    return client.delete(`/videos/${id}`);
  }

  public postVideo(
    data: {
      video: File;
      title: string;
      privacy?: 'public' | 'private';
      description?: string;
      categories?: Category[];
      thumbnailTimestamp?: number;
    },
    options?: {
      onUploadProgress?: (progressEvent: ProgressEvent) => void;
      onUploadComplete?: (res: Video) => void;
      onUploadError?: (err: Error) => void;
    }
  ): () => void {
    const payload = {
      video: data.video,
      title: data.title,
      description: data.description,
      thumbnail_timestamp: data.thumbnailTimestamp,
      categories: data.categories
        ? data.categories.map((category) => category.category).join(',')
        : '',
    };
    const source = axios.CancelToken.source();

    client
      .post('/videos/', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: options?.onUploadProgress,
        cancelToken: source.token,
      })
      .then(options?.onUploadComplete as any)
      .catch(options?.onUploadError);

    return () => source.cancel('Upload cancelled');
  }

  public updateVideo(videoId: string, data: Partial<PatchVideoPayload>): Promise<ApiMessage> {
    return client.patch('/videos/' + videoId, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  public reportVideo(videoId: string, reason: string): Promise<ApiMessage> {
    return client.post('/reports', { reason: reason, video_id: videoId });
  }

  public getVideoAnalysis(
    videoId: string,
    params?: Partial<GetVideoAnalysisParams>
  ): Promise<IVideoAnalysis> {
    return client.get(`/videos/${videoId}/analysis`, { params });
  }
}

export default new VideoApi();
