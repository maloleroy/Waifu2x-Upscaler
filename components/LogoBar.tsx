/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Waifu2x Upscaler - A cute image upscaler ❤                *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import logo from "../assets/images/logo.png"
import "./styles/logobar.less"

const LogoBar: React.FunctionComponent = () => {
    return (
        <section className="logo-bar">
            <div className="logo-bar-container">
                <img src={logo} className="logo" width="418" height="118"/>
            </div>
        </section>
    )
}

export default LogoBar
