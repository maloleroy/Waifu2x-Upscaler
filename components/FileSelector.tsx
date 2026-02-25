import React, {useEffect, useEffectEvent, useState} from "react"
import FileSelectorIcon from "../assets/svg/file-selector.svg"
import FileSelectorDragIcon from "../assets/svg/file-selector-drag.svg"
import "./styles/fileselector.less"

const FileSelector: React.FunctionComponent = (props) => {
    const [hover, setHover] = useState(false)
    const [drag, setDrag] = useState(false)
    const [id, setID] = useState(1)
    const [color, setColor] = useState("light")

    useEffect(() => {
        const addFile = (event: any, file: string, pos: number) => {
            setID((prev) => {
                window.ipcRenderer.invoke("add-file-id", file, pos, prev)
                return prev + 1
            })
        }
        const updateColor = (event: any, color: string) => {
            setColor(color)
        }
        window.ipcRenderer.on("add-file", addFile)
        window.ipcRenderer.on("open-file", selectFiles)
        window.ipcRenderer.on("update-color", updateColor)
        return () => {
            window.ipcRenderer.removeListener("add-file", addFile)
            window.ipcRenderer.removeListener("update-color", updateColor)
            window.ipcRenderer.removeListener("open-file", selectFiles)
        }
    }, [])

    const drop = useEffectEvent(async (event: React.DragEvent) => {
        event.preventDefault()
        setDrag(false)

        let files = [] as string[]
        for (let i = 0; i < event.dataTransfer.files.length; i++) {
            files.push(window.webUtils.getPathForFile(event.dataTransfer.files[i]))
        }

        if (files[0]) {
            const identifers = []
            let counter = id
            for (let i = 0; i < files.length; i++) {
                const type = await window.ipcRenderer.invoke("get-type", files[i])
                if (!type) continue
                identifers.push(counter)
                counter += 1
                setID((prev) => prev + 1)
            }
            window.ipcRenderer.invoke("add-files", files, identifers)
        }
    })

    const dragOver = (event: React.DragEvent) => {
        event.preventDefault()
        setDrag(true)
    }

    const dragLeave = () => {
        setDrag(false)
    }

    const selectFiles = useEffectEvent(async () => {
        setHover(false)
        const files = await window.ipcRenderer.invoke("select-files")
        if (files[0]) {
            const identifers = []
            let counter = id
            for (let i = 0; i < files.length; i++) {
                const type = await window.ipcRenderer.invoke("get-type", files[i])
                if (!type) continue
                identifers.push(counter)
                counter += 1
                setID((prev) => prev + 1)
            }
            window.ipcRenderer.invoke("add-files", files, identifers)
        }
    })

    return (
        <section className="file-selector" onDrop={drop} onDragOver={dragOver} onDragLeave={dragLeave}>
            <div className="file-selector-img">
                {drag ?
                <FileSelectorDragIcon className="file-selector-img-text" style={{filter: hover ? "brightness(0) invert(1)" : ""}}/> :
                <FileSelectorIcon className="file-selector-img-text" style={{filter: hover ? "brightness(0) invert(1)" : ""}}/>}
            </div>
            <div className="file-selector-hover" onClick={selectFiles} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}></div>
        </section>
    )
}

export default FileSelector
