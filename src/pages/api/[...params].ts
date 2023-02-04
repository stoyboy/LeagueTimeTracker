// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios, { AxiosError } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'

export interface IPlaytimeData {
  time: number;
}

export interface IPlaytimeError {
  error: string;
}

interface ISummoner {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

interface IMastery {
  championId: number;
  championLevel: number;
  championPoints: number;
  lastPlayTime: number;
  championPointsSinceLastLevel: number;
  championPointsUntilNextLevel: number;
  chestGranted: boolean;
  tokensEarned: number;
  summonerId: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IPlaytimeData | IPlaytimeError>
) {
  const [server, summoner] = req.query.params as string[]
  const { captcha } = req.query

  try {
    const response = await axios(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        },
        method: "POST",
      }
    );

    if (!response.data.success) return res.status(401).json({ error: "RECAPTCHA/INVALID" })
  }
  catch (err) {
    res.status(401).json({ error: "RECAPTCHA/INVALID" })
  }

  try {
    //fetching encrypted summoner id
    const summonerRequest = await axios<ISummoner>({
      method: 'GET',
      url: `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner}?api_key=${process.env.RIOT_API_KEY}`,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    //using encrypted summoner id to get masterypoints
    const masteryRequest = await axios<IMastery[]>({
      method: 'GET',
      url: `https://${server}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerRequest.data.id}?api_key=${process.env.RIOT_API_KEY}`,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const totalMasteryPoints = masteryRequest.data.reduce(
      (accumulator, currentValue) => accumulator + currentValue.championPoints,
      0
    );

    const playedMinutes = totalMasteryPoints / 20
    const playedHours = Math.round(playedMinutes / 60 * 100) / 100

    res.json({
      time: playedHours
    })
  }
  catch (err) {
    const error = err as AxiosError

    if (error.isAxiosError) {
      if (error.response?.status == 404)
        res.status(404).send({ error: "RIOT/NOT_FOUND" })
      else
        res.status(500).send({ error: "RIOT/SERVER_ERROR" })
    }
    else {
      res.status(500).send({ error: "API/SERVER_ERROR" })
    }

  }
}
