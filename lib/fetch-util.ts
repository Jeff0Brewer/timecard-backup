const postBody = (data: object) => {
    return {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }
}

const getDateJson = (res: Response) => {
    return res.json()
        .then(data => {
            data.date = new Date(data.date)
            return data
        })
}

export {
    postBody,
    getDateJson
}
