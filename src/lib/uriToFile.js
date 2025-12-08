const getMimeType = (ext) => {
    const map = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        heic: "image/heic",
        webp: "image/webp",
    }
    return map[ext] || "application/octet-stream"
}

export const uriToFileObject = async (uri) => {
    const blob = await fetch(uri).then((res) => res.blob())
    const ext = uri.split(".").pop()?.toLowerCase()
    const filename = uri.split("/").pop() || `image_${Date.now()}.${ext}`
    const mime = blob.type || getMimeType(ext)

    // File-like object 생성
    return {
        uri,
        name: filename,
        type: mime,
        size: blob.size,
        blob, // 필요하면 blob도 포함
    }
}
