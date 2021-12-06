import { AvailableHourUpdate, HallId } from 'shared';
import * as api from '../api';

type Time = {
  duration: number;
  // 202111072200-60-4Nm9eXsAFueVfu5S65HV
  key: string;
};

type Item = {
  category: string;
  times: Time[];
  // court (eg. Kenttä15)
  displayName: string;
};

export async function talitaivallahti(): Promise<AvailableHourUpdate[]> {
  const { data } = await api.get(
    'https://falcon-328a1.firebaseio.com/freetimes/tali-2GjtFLost8pDf0dWwmNc.json'
  );
  //const data = await api.fakeJson('falcon.json');
  return [...talinTenniskeskus(data), ...taivallahti(data)];
}

function talinTenniskeskus(data: any): AvailableHourUpdate[] {
  return transform('talin-tenniskeskus', 'tennis', data);
}

function taivallahti(data: any): AvailableHourUpdate[] {
  return transform('taivallahti', 'tennis taivallahti', data);
}

function transform(
  hallId: HallId,
  category: string,
  data: any
): AvailableHourUpdate[] {
  const tali = Object.entries(data)
    .map(([, byNumber]) => byNumber)
    .flatMap((item) =>
      Object.entries(item as {})
        .map(([, byHash]) => {
          //console.log(byHash);
          return byHash as Item;
        })
        .filter((i) => {
          // console.log(i.category);
          // category tennis === tali, category tennis taivallahti === taivallahti
          return i.category === category;
        })
    )
    .flatMap((item) => {
      // console.log(item.times);
      return item.times
        .filter((time) => [30, 60].includes(time.duration))
        .map((time) => {
          return {
            hour: `${time.key.slice(8, 10)}:${time.key.slice(10, 12)}`,
            day: `${time.key.slice(0, 4)}-${time.key.slice(
              4,
              6
            )}-${time.key.slice(6, 8)}`,
            court: item.displayName,
            thirtyMinutes: time.duration === 30,
          };
        });
    });

  return Object.values(
    tali.reduce((acc, current) => {
      if (acc[current.day]) {
        acc[current.day].hours = [
          ...acc[current.day].hours,
          {
            hour: current.hour,
            court: current.court,
            courtType: 'INSIDE',
            thirtyMinutes: current.thirtyMinutes,
          },
        ];
        return acc;
      }

      acc[current.day] = {
        hallId,
        link: 'https://talitaivallahti.feel.cintoia.com/',
        type: 'TENNIS',
        day: current.day,
        hours: [
          {
            hour: current.hour,
            court: current.court,
            courtType: 'INSIDE',
            thirtyMinutes: current.thirtyMinutes,
          },
        ],
      };
      return acc;
    }, {} as Record<string, AvailableHourUpdate>)
  );
}
