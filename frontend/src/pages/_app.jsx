import '../styles/tw.css'
import Head from 'next/head'
import Script from 'next/script'

export default function App({ Component, pageProps }){
    return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Component {...pageProps} />
      </>
    )
}
