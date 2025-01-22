import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Slider } from "@mui/material";
import { Button, IconButton, Box, Typography } from "@mui/material";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeOff,
} from "@mui/icons-material";

function VideoPlayer({
  width = "100%",
  height = "100%",
  url,
  onProgressUpdate,
  progressData,
}) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const handlePlayAndPause = () => {
    setPlaying(!playing);
  };

  const handleProgress = (state) => {
    if (!seeking) {
      setPlayed(state.played);
    }
  };

  const handleRewind = () => {
    playerRef?.current?.seekTo(playerRef?.current?.getCurrentTime() - 5);
  };

  const handleForward = () => {
    playerRef?.current?.seekTo(playerRef?.current?.getCurrentTime() + 5);
  };

  const handleToggleMute = () => {
    setMuted(!muted);
  };

  const handleSeekChange = (newValue) => {
    setPlayed(newValue[0]);
    setSeeking(true);
  };

  const handleSeekMouseUp = () => {
    setSeeking(false);
    playerRef.current?.seekTo(played);
  };

  const handleVolumeChange = (newValue) => {
    setVolume(newValue[0]);
  };

  const pad = (string) => {
    return ("0" + string).slice(-2);
  };

  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());

    if (hh) {
      return `${hh}:${pad(mm)}:${ss}`;
    }

    return `${mm}:${ss}`;
  };

  const handleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      if (playerContainerRef?.current.requestFullscreen) {
        playerContainerRef?.current?.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullScreen]);

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    if (played === 1) {
      onProgressUpdate({
        ...progressData,
        progressValue: played,
      });
    }
  }, [played]);

  return (
    <Box
      ref={playerContainerRef}
      sx={{
        position: "relative",
        backgroundColor: "grey.900",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 6,
        width: width,
        height: height,
        transition: "all 0.3s ease-in-out",
        ...(isFullScreen && { width: "100vw", height: "100vh" }),
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      <ReactPlayer
        ref={playerRef}
        className="absolute top-0 left-0"
        width="100%"
        height="100%"
        url={url}
        playing={playing}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
      />
      {showControls && (
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(33, 33, 33, 0.75)",
            padding: 2,
            opacity: 1,
            transition: "opacity 0.3s",
          }}
        >
          <Slider
            value={[played * 100]}
            max={100}
            step={0.1}
            onChange={(event, newValue) => handleSeekChange([newValue / 100])}
            onChangeCommitted={handleSeekMouseUp}
            sx={{ width: "100%", mb: 2 }}
          />
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center">
              <IconButton onClick={handlePlayAndPause} color="inherit">
                {playing ? (
                  <Pause sx={{ fontSize: 24 }} />
                ) : (
                  <Play sx={{ fontSize: 24 }} />
                )}
              </IconButton>
              <IconButton onClick={handleRewind} color="inherit">
                <RotateCcw sx={{ fontSize: 24 }} />
              </IconButton>
              <IconButton onClick={handleForward} color="inherit">
                <RotateCw sx={{ fontSize: 24 }} />
              </IconButton>
              <IconButton onClick={handleToggleMute} color="inherit">
                {muted ? (
                  <VolumeOff sx={{ fontSize: 24 }} />
                ) : (
                  <Volume2 sx={{ fontSize: 24 }} />
                )}
              </IconButton>
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onChange={(event, newValue) => handleVolumeChange([newValue / 100])}
                sx={{ width: 100 }}
              />
            </Box>
            <Box display="flex" alignItems="center">
              <Typography variant="body2" color="white">
                {formatTime(played * (playerRef?.current?.getDuration() || 0))} /{" "}
                {formatTime(playerRef?.current?.getDuration() || 0)}
              </Typography>
              <IconButton onClick={handleFullScreen} color="inherit">
                {isFullScreen ? (
                  <Minimize sx={{ fontSize: 24 }} />
                ) : (
                  <Maximize sx={{ fontSize: 24 }} />
                )}
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default VideoPlayer;
