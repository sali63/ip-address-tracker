import React, { useEffect, useState } from 'react';
import { useWindowWidth } from '@react-hook/window-size';

import Head from 'next/head';
import Image from 'next/image';
import dynamic from 'next/dynamic';

import { getLocationInfo } from './../lib/lib';

import submitArrow from '../public/icon-arrow.svg';
import bgPattern from '../public/pattern-bg.png';

const ipUrl = 'http://ip-api.com/json/';

export default function Home() {
  const windowWidth = useWindowWidth();

  const MapWithNoSSR = dynamic(() => import('./../components/map'), {
    ssr: false,
  });

  const [currLocation, setCurrLocation] = useState({});
  const [ipAddress, setIpAddress] = useState('');
  const [locationInfo, setLocationInfo] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${ipUrl}${ipAddress}?fields=33612788`;
    try {
      const data = await getLocationInfo(url);
      const { lat, lon } = data;
      setCurrLocation({ lat, lon });
      setLocationInfo(data);
      setIpAddress(data.query);
    } catch (e) {
      console.log(e);
    }
  };

  const calculateUTC = (offset) => {
    const absoluteOffset = Math.abs(offset);
    const remainingMinInSecs = absoluteOffset % 3600;

    let minutes = (remainingMinInSecs && remainingMinInSecs) / 60 || 0;
    if (!minutes) minutes = '00';

    let hours = (absoluteOffset - remainingMinInSecs) / 3600;
    if (hours < 10) hours = `0${hours}`;

    return `UTC -${hours}:${minutes}`;
  };

  useEffect(async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude: lat, longitude: lon } }) => {
          setCurrLocation({ lat, lon });
        }
      );
    } else {
      throw new Error('Geolocation is not supported by this browser.');
    }

    try {
      const data = await getLocationInfo(`${ipUrl}?fields=33612788`);
      // setIpAddress(data.query);
      setLocationInfo(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const { isp, zip, region, city, query, offset } = locationInfo;
  return (
    <div>
      <Head>
        <title>Frontend Mentor | IP Address Tracker</title>
        <link rel='icon' href='/favicon.ico' />
        {/* <link
          rel='stylesheet'
          href='https://unpkg.com/leaflet@1.7.1/dist/leaflet.css'
          integrity='sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=='
          crossorigin=''
        />

        <script
          src='https://unpkg.com/leaflet@1.7.1/dist/leaflet.js'
          integrity='sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=='
          crossorigin=''
        ></script> */}
      </Head>
      <main className='min-h-screen relative'>
        <section className='relative pt-72 md:h-72 md:pt-0'>
          {(windowWidth > 767 && (
            <Image src={bgPattern} alt='background pattern' layout='fill' />
          )) || (
            <Image
              src={bgPattern}
              alt='background pattern'
              layout='fill'
              objectFit='cover'
            />
          )}
        </section>
        <section className='absolute h-1/2 top-6 left-0 right-0 px-4 text-center z-9999'>
          <h2 className='font-rubik text-2xl text-white font-medium '>
            IP Address Tracker
          </h2>
          <form
            onSubmit={handleSubmit}
            className='pt-6 pb-4 lg:pb-7 xl:pb-8 max-w-lg mx-auto'
          >
            <div>
              <input
                type='text'
                placeholder='Search for any IP address or domain'
                className='w-10/12 py-3 px-4 rounded-tl-xl rounded-bl-xl focus:outline-none '
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                tabIndex='0'
              />
              <button
                type='submit'
                className='w-2/12 bg-black rounded-tr-xl rounded-br-xl py-3 hover:bg-primary-gray-dark'
              >
                <Image src={submitArrow} alt='submit arrow' />
              </button>
            </div>
          </form>
          <article className='bg-white rounded-xl py-6 xl:p-0 max-w-4xl mx-auto xl:h-36'>
            <div className='xl:h-full '>
              <ul className='xl:flex xl:h-full xl:pb-12 xl:pt-8 xl:flex-row xl:items-center xl:justify-evenly xl:divide-x xl:divide-gray-400'>
                <li className='flex   flex-col text-center xl:h-full xl:text-left '>
                  <span className='font-rubik font-bold uppercase text-primary-gray-dark opacity-40 text-xs'>
                    ip address
                  </span>
                  <span className='text-primary-gray-dark   font-rubik text-lg font-medium'>
                    {query}
                  </span>
                </li>
                <li className='flex   flex-col text-center xl:h-full xl:text-left pt-4 xl:pt-0 xl:px-5'>
                  <span className='font-rubik font-bold uppercase text-primary-gray-dark opacity-40 text-xs'>
                    Location
                  </span>
                  <span className='text-primary-gray-dark font-rubik text-lg font-medium'>
                    {`${city}, ${region}`}
                    <p>{zip}</p>
                  </span>
                </li>
                <li className='flex   flex-col text-center xl:h-full xl:text-left pt-4 xl:pt-0 xl:px-5'>
                  <span className='font-rubik font-bold uppercase text-primary-gray-dark opacity-40 text-xs'>
                    Timezone
                  </span>
                  <span className='text-primary-gray-dark font-rubik text-lg font-medium'>
                    {calculateUTC(offset)}
                  </span>
                </li>
                <li className='flex   flex-col text-center xl:h-full xl:text-left pt-4 xl:pt-0 xl:pl-5'>
                  <span className='font-rubik font-bold uppercase text-primary-gray-dark opacity-40 text-xs xl:w-60'>
                    ISP
                  </span>
                  <span className='text-primary-gray-dark   font-rubik text-lg font-medium'>
                    <p>{isp}</p>
                  </span>
                </li>
              </ul>
            </div>
          </article>
        </section>
        <section className='h-screen'>
          <MapWithNoSSR currLocation={currLocation} windowWidth={windowWidth} />
        </section>
      </main>
    </div>
  );
}
