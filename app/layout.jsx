import "@styles/globals.css"
import Nav from '@components/Nav'
import Provider from "@components/Provider"

export const metadata = {
    title: "Echo",
    description: "Digital Time Capsule",
    
}

const RootLayout = ({children}) => {
  return (
    <html lang="en">
        <head>
            <link rel="favicon" href="/assets/images/logo.svg" type="image/x-icon" />
        </head>
        <body>
            <Provider>
            <div className="main">
                <div className="gradiant" />
            </div>
            <main className="app">
                <Nav/>
                {children}
            </main>
            </Provider>
        </body>
    </html>
  )
}

export default RootLayout