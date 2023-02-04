import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { SubmitHandler } from 'react-hook-form/dist/types';
import { Listbox, Transition } from '@headlessui/react';
import { createRef, Fragment, useState } from 'react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import axios, { AxiosError } from 'axios';
import { IPlaytimeData, IPlaytimeError } from './api/[...params]';
import ReCAPTCHA from 'react-google-recaptcha';

type FormValues = {
  summoner: string;
};

const servers = [
  { name: 'EUW', prefix: 'EUW1' },
  { name: 'EUNE', prefix: 'EUN1' },
  { name: 'NA', prefix: 'NA1' },
  { name: 'BR', prefix: 'BR1' },
  { name: 'LAN', prefix: 'LA1' },
  { name: 'LAS', prefix: 'LA2' },
  { name: 'OCE', prefix: 'OC1' },
  { name: 'RU', prefix: 'RU1' },
  { name: 'TR', prefix: 'TR1' },
  { name: 'JP', prefix: 'JP1' },
  { name: 'KR', prefix: 'KR' },
  { name: 'PH', prefix: 'PH2' },
  { name: 'SG', prefix: 'SG2' },
  { name: 'TW', prefix: 'TW2' },
  { name: 'TW', prefix: 'TW2' },
  { name: 'TH', prefix: 'TH2' },
  { name: 'VN', prefix: 'VN2' },
];

export default function Home() {
  const [playtime, setPlaytime] = useState<number | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const [selectedServer, setSelectedServer] = useState(servers[0]);
  const { register, handleSubmit } = useForm<FormValues>();
  const recaptchaRef = createRef<ReCAPTCHA>();

  const onSubmit: SubmitHandler<FormValues> = async ({ summoner }) => {
    const token = await recaptchaRef.current?.executeAsync();

    if (summoner != '' && token) {
      try {
        const response = await axios.get<IPlaytimeData>(
          `/api/${selectedServer.prefix.toLowerCase()}/${summoner}?captcha=${token}`
        );

        if (response) {
          recaptchaRef.current?.reset();
          setTimeout(() => setRequestError(null), 500);
          setVisible(false);
          setTimeout(() => {
            setPlaytime(response.data.time);
            setVisible(true);
          }, 500);
        }
      } catch (err) {
        setTimeout(() => setPlaytime(null), 500);
        setVisible(false);
        setTimeout(() => {
          const error = err as AxiosError<IPlaytimeError>;

          if (error.isAxiosError) {
            setRequestError(error.response?.data.error!);
          }
          setVisible(true);
        }, 500);
      }
    }
  };

  return (
    <>
      <Head>
        <title>League Timer Tracker</title>
        <meta
          name='description'
          content='Have you ever wondered how much you have been playing League? Well, now you can find out!'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='w-full h-screen flex flex-col justify-center items-center gap-4 bg-gradient-to-br from-rose-900 to-black'>
        <motion.div
          initial='hidden'
          animate='visible'
          transition={{ duration: 0.5 }}
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
            },
          }}
          className='flex flex-col justify-center items-center gap-4 p-4 rounded-lg bg-black bg-opacity-20 text-white text-2xl font-semibold select-none'
        >
          <Image
            src='/pepeDS.gif'
            alt='pepeDS'
            width={100}
            height={24}
            priority
          />
          <span>League Time Tracker</span>
          <Link href={'https://google.com'}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              xmlnsXlink='http://www.w3.org/1999/xlink'
              width='95.5'
              height='28'
              role='img'
              aria-label='GITHUB'
            >
              <title>GITHUB</title>
              <g shape-rendering='crispEdges'>
                <rect width='95.5' height='28' fill='#121011' />
              </g>
              <g
                fill='#fff'
                textAnchor='middle'
                fontFamily='Verdana,Geneva,DejaVu Sans,sans-serif'
                textRendering='geometricPrecision'
                fontSize='100'
              >
                <image
                  x='9'
                  y='7'
                  width='14'
                  height='14'
                  xlinkHref='data:image/svg+xml;base64,PHN2ZyBmaWxsPSJ3aGl0ZXNtb2tlIiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+R2l0SHViPC90aXRsZT48cGF0aCBkPSJNMTIgLjI5N2MtNi42MyAwLTEyIDUuMzczLTEyIDEyIDAgNS4zMDMgMy40MzggOS44IDguMjA1IDExLjM4NS42LjExMy44Mi0uMjU4LjgyLS41NzcgMC0uMjg1LS4wMS0xLjA0LS4wMTUtMi4wNC0zLjMzOC43MjQtNC4wNDItMS42MS00LjA0Mi0xLjYxQzQuNDIyIDE4LjA3IDMuNjMzIDE3LjcgMy42MzMgMTcuN2MtMS4wODctLjc0NC4wODQtLjcyOS4wODQtLjcyOSAxLjIwNS4wODQgMS44MzggMS4yMzYgMS44MzggMS4yMzYgMS4wNyAxLjgzNSAyLjgwOSAxLjMwNSAzLjQ5NS45OTguMTA4LS43NzYuNDE3LTEuMzA1Ljc2LTEuNjA1LTIuNjY1LS4zLTUuNDY2LTEuMzMyLTUuNDY2LTUuOTMgMC0xLjMxLjQ2NS0yLjM4IDEuMjM1LTMuMjItLjEzNS0uMzAzLS41NC0xLjUyMy4xMDUtMy4xNzYgMCAwIDEuMDA1LS4zMjIgMy4zIDEuMjMuOTYtLjI2NyAxLjk4LS4zOTkgMy0uNDA1IDEuMDIuMDA2IDIuMDQuMTM4IDMgLjQwNSAyLjI4LTEuNTUyIDMuMjg1LTEuMjMgMy4yODUtMS4yMy42NDUgMS42NTMuMjQgMi44NzMuMTIgMy4xNzYuNzY1Ljg0IDEuMjMgMS45MSAxLjIzIDMuMjIgMCA0LjYxLTIuODA1IDUuNjI1LTUuNDc1IDUuOTIuNDIuMzYuODEgMS4wOTYuODEgMi4yMiAwIDEuNjA2LS4wMTUgMi44OTYtLjAxNSAzLjI4NiAwIC4zMTUuMjEuNjkuODI1LjU3QzIwLjU2NSAyMi4wOTIgMjQgMTcuNTkyIDI0IDEyLjI5N2MwLTYuNjI3LTUuMzczLTEyLTEyLTEyIi8+PC9zdmc+'
                />
                <text
                  transform='scale(.1)'
                  x='577.5'
                  y='175'
                  textLength='515'
                  fill='#fff'
                  fontWeight='bold'
                >
                  GITHUB
                </text>
              </g>
            </svg>
          </Link>
        </motion.div>
        <form
          className='flex flex-col md:flex-row gap-4 flex-wrap mx-24'
          onSubmit={handleSubmit(onSubmit)}
          autoComplete='off'
        >
          {/* Serverselection */}
          <Listbox value={selectedServer} onChange={setSelectedServer}>
            <div className='relative'>
              <Listbox.Button className='relative w-64 cursor-default rounded-lg bg-black bg-opacity-20 hover:bg-opacity-30 py-2 pl-3 pr-10 h-12 text-left text-white shadow-md'>
                <span className='block truncate'>{selectedServer.name}</span>
                <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                  <ChevronUpDownIcon
                    className='h-5 w-5 text-white'
                    aria-hidden='true'
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave='transition ease-in duration-100'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <Listbox.Options className='absolute mt-2 w-full overflow-auto rounded-md bg-white p-1 text-base shadow-lg grid grid-cols-3'>
                  {servers.map((server, serverIdx) => (
                    <Listbox.Option
                      key={serverIdx}
                      className={({ active }) =>
                        `relative cursor-default select-none rounded-lg py-2 px-4 ${
                          active ? 'bg-rose-900 text-white' : 'text-gray-900'
                        }`
                      }
                      value={server}
                    >
                      {({ selected }) => (
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {server.name}
                        </span>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>

          {/* Username input */}
          <input
            placeholder='Username'
            autoComplete='off'
            className='items-center w-64 text-left space-x-3 px-4 h-12 shadow-sm rounded-lg text-white bg-black bg-opacity-20 hover:bg-opacity-30'
            {...register('summoner')}
          />

          <button
            type='submit'
            className='flex justify-center items-center text-left space-x-3 px-4 h-12 shadow-sm rounded-lg text-gray-300 bg-black bg-opacity-20 hover:bg-opacity-30 w-64 md:w-auto'
          >
            <svg
              width='24'
              height='24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='flex-none text-gray-300'
              aria-hidden='true'
            >
              <path d='m19 19-3.5-3.5'></path>
              <circle cx='11' cy='11' r='6'></circle>
            </svg>
          </button>
        </form>

        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY as string}
          size={'invisible'}
          theme={'dark'}
        />

        {/* Output */}
        <motion.div
          initial='hidden'
          animate={visible ? 'visible' : 'hidden'}
          transition={{ duration: 0.5 }}
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
            },
          }}
          className='flex items-center text-left space-x-3 px-4 py-3 shadow-sm rounded-lg text-white bg-black bg-opacity-20 mx-12 select-none'
        >
          {playtime != null && (
            <span>
              You have wasted{' '}
              <span className='font-bold'>{playtime} hours</span> playing League
              of Legends. {playtime > 1000 && 'Go touch some grass.'}
            </span>
          )}
          {requestError == 'RIOT/NOT_FOUND' && (
            <span className='text-red-400'>
              Yikes that account doesn't exist.
            </span>
          )}
          {requestError == 'RIOT/SERVER_ERROR' ||
            (requestError == 'API/SERVER_ERROR' && (
              <span className='text-red-400'>Welp something went wrong.</span>
            ))}
          {requestError == 'RECAPTCHA/INVALID' && (
            <span className='text-red-400'>Bro, complete the captcha.</span>
          )}
        </motion.div>
      </main>
    </>
  );
}
