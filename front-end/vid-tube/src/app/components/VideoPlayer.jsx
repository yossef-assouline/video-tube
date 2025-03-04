export default function VideoPlayer({ video }) {
  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <video
        src={video.videoFile}
        controls
        autoPlay={true}
        className="w-full h-full"
        poster={video.thumbnail}
      />
    </div>
  );
}
