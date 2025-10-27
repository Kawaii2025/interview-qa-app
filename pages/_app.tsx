import '@/styles/globals.css'; // 引入 Tailwind 全局样式

import Head from 'next/head';

function MyApp({ Component, pageProps }: { Component: React.ComponentType<any>; pageProps: any }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css"
        /> */}
        <title>面试题刷题平台</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;


// // pages/_app.js
// import '@/styles/globals.css'; // 引入 Tailwind 全局样式

// function MyApp({ Component, pageProps }: { Component: React.ComponentType<any>; pageProps: any }) {
//   return <Component {...pageProps} />
// }

// export default MyApp
