import { orderPhotoApi } from '@/lib/api'

const queue = []
let isWorking = false

// 원하는 값으로 조절
const MAX_RETRY = 3
const RETRY_BASE_DELAY_MS = 1200

export function enqueueUpload(job) {
    // job: { id, uri, mimeType, file, extra? }

    let resolveFn, rejectFn

    const promise = new Promise((resolve, reject) => {
        resolveFn = resolve
        rejectFn = reject
    })

    queue.push({
        ...job,
        resolveFn,
        rejectFn,
        retryCount: job.retryCount ?? 0,
        createdAt: Date.now(),
    })

    setTimeout(() => workLoop(), 0)

    return promise
}

async function workLoop() {
    if (isWorking) return

    isWorking = true

    while (queue.length > 0) {
        const job = queue.shift()

        try {
            const result = await uploadOne(job)
            job.resolveFn(result)
        }
        catch (err) {
            if (job.retryCount < MAX_RETRY) {
                const nextRetry = job.retryCount + 1
                const delay = RETRY_BASE_DELAY_MS * Math.pow(2, job.retryCount)

                await sleep(delay)

                queue.push({
                    ...job,
                    retryCount: nextRetry,
                    lastError: err?.message ?? String(err),
                })
            }
            else {
                console.warn("[UPLOAD GIVE UP]", job.id, err)
                job.rejectFn(err)
            }
        }
    }

    isWorking = false
}

async function uploadOne(job) {
    const file = job.file
    const list = await orderPhotoApi.uploads(job.extra)

    if (!Array.isArray(list) || list.length === 0)
        throw new Error("[서버 오류] 이미지 등록 실패")

    const item = list[0]
    const res = await fetch(item.url, {
        method: "PUT",
        headers: {
            'Content-Type': file.type,
        },
        body: file.blob
    })

    if (!res.ok)
        throw new Error(`Upload failed: ${res.status}`)

    return true
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
