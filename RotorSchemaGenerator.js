function generateSchemaKey() {
    function randomABCkeys() {
        const size = 26
        let keys = [...Array(size).keys()]

        keys.sort(() => Math.random() - 0.5)
        return keys
    }
    let firstKey = randomABCkeys()
    let secondKey = randomABCkeys()

    const schemaKey = Array.from(firstKey, (x, y) => [x, secondKey[y]])
    console.log(schemaKey)
}

generateSchemaKey()
