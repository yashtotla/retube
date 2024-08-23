const INITIAL_PLAYER_RESPONSE_REGEX = /ytInitialPlayerResponse\s*=\s*({.+?})\s*;\s*(?:var\s+(?:meta|head)|<\/script|\n)/

const compareCaptionTracks = (a, b) => {
  const langaugeA = a.languageCode
  const langaugeB = b.languageCode
  if (langaugeA === "en" && langaugeB !== "en") return -1
  else if (langaugeA !== "en" && langaugeB === "en") return 1
  else if (a.kind !== "asr" && b.kind === "asr") return -1
  else if (a.kind === "asr" && b.kind !== "asr") return 1
  return 0
}

const getVideoData = async (videoId: string) => {
  // @ts-ignore
  let player = window.ytInitialPlayerResponse
  if (!player || videoId !== player.videoDetails.videoId) {
    const pageData = await fetch(`https://www.youtube.com/watch?v=${videoId}`)
    const body = await pageData.text()
    const playerResponseMatch = body.match(INITIAL_PLAYER_RESPONSE_REGEX)
    if (!playerResponseMatch) {
      console.error("Failed to parse player response")
      return
    }
    player = JSON.parse(playerResponseMatch[1])
  }
  const metadata = {
    title: player.videoDetails.title,
    duration: player.videoDetails.lengthSeconds,
    author: player.videoDetails.author,
    views: player.videoDetails.viewCount,
  }
  let transcript = null
  if (player.captions && player.captions.playerCaptionsTracklistRenderer) {
    const tracks = player.captions.playerCaptionsTracklistRenderer.captionTracks
    if (tracks && tracks.length > 0) {
      tracks.sort(compareCaptionTracks)
      const transcriptResponse = await fetch(`${tracks[0].baseUrl}&fmt=json3`)
      transcript = await transcriptResponse.json()
    }
  }
  return { metadata, transcript }
}

export { getVideoData }
