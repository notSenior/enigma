const {
    connectSchema1,
    connectSchema2,
    connectSchema3,
    statorSchema,
} = require("./RotorSchemas.js")

class ABC {
    static abs = "abcdefghijklmnopqrstuvwxyz"
    static letterToNumber(letter) {
        return this.abs.indexOf(letter)
    }
    static numberToletter(number) {
        return this.abs[number]
    }
}

class Rotor {
    constructor(schema, startCursor, speed) {
        this.schema = schema
        this.cursor = startCursor
        this.decodeCursor = startCursor
        this.speed = speed
    }

    code(letterPos, direction) {
        this.turn()

        let search = this.compareShiftCursor(letterPos)
        let result = this.schema.find((el) => el[direction] == search)[direction]
        return result
    }
    decode(letterPos, direction) {
        this.turnDecode()

        let real_position = this.cycleItterator(this.decodeCursor)

        direction == 0 ? real_position++ : real_position--

        let result = this.schema.find((el) => el[direction] == letterPos)[direction] - real_position

        while (result < 0) {
            result += this.schema.length
        }

        return result
    }
    turnDecode() {
        this.decodeCursor++
        if (this.decodeCursor > this.schema.length) this.decodeCursor -= this.schema.length
    }
    turn() {
        this.cursor++
        if (this.cursor > this.schema.length) this.cursor -= this.schema.length
    }

    cycleItterator(itterator) {
        while (itterator > this.schema.length) {
            console.log(itterator)
            itterator = Math.floor(itterator / Math.pow(this.schema.length, this.speed))
        }

        return itterator
    }

    compareShiftCursor(shift) {
        let normalizeShift = this.cycleItterator(this.cursor) + shift

        while (normalizeShift >= this.schema.length) {
            normalizeShift -= this.schema.length
        }

        return normalizeShift
    }
}

class Stator {
    constructor() {
        this.schema = statorSchema
    }
    find(i) {
        return this.schema.find((el) => el[0] == i)[1]
    }
}

class Enigma {
    constructor(...rotorParams) {
        this.firstRotor = new Rotor(connectSchema1, rotorParams[0], 2)
        this.secondRotor = new Rotor(connectSchema2, rotorParams[1], 1)
        this.thirdRotor = new Rotor(connectSchema3, rotorParams[2], 0)
        this.stator = new Stator()
    }

    prepareText(text) {
        text = text.toLowerCase()
        text = Array.from(text.replace(" ", ""))
        return text.map((el) => ABC.letterToNumber(el))
    }
    translateToText(mask) {
        return mask.map((el) => ABC.numberToletter(el)).join("")
    }

    encode(text) {
        let preMask = this.prepareText(text)

        let criptText = preMask.map((number) => {
            number = this.thirdRotor.code(number, 0)
            number = this.secondRotor.code(number, 0)
            number = this.firstRotor.code(number, 0)
            number = this.stator.find(number)
            number = this.firstRotor.code(number, 1)
            number = this.secondRotor.code(number, 1)
            number = this.thirdRotor.code(number, 1)
            return number
        })

        return this.translateToText(criptText)
    }

    decode(text) {
        let preMask = this.prepareText(text)

        let criptText = preMask.map((number) => {
            number = this.thirdRotor.decode(number, 0)
            number = this.secondRotor.decode(number, 0)
            number = this.firstRotor.decode(number, 0)
            number = this.stator.find(number)
            number = this.firstRotor.decode(number, 1)
            number = this.secondRotor.decode(number, 1)
            number = this.thirdRotor.decode(number, 1)

            return number
        })
        return this.translateToText(criptText)
    }
}

const machine = new Enigma(5, 14, 3)
let cipherText = machine.encode(
    "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
)
console.log(cipherText)
let decipheredText = machine.decode(cipherText)
console.log(decipheredText)
