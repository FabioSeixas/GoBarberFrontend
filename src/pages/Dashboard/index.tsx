import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { isToday, format, parseISO, isBefore, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { FiClock, FiPower } from 'react-icons/fi';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';
import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  Calendar,
  NextAppointment,
  Section,
  Appointment,
} from './styles';

import logoImg from '../../assets/logo.svg';
import api from '../../services/api';

interface IMonthAvailability {
  day: number;
  available: boolean;
  date: Date;
}

interface AppointmentData {
  id: string;
  date: string;
  formattedHour: string;
  user: {
    avatar_url: string;
    name: string;
  };
}

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<
    IMonthAvailability[]
  >([]);
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);

  const { signOut, user } = useAuth();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  useEffect(() => {
    api
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          month: currentMonth.getMonth() + 1,
          year: currentMonth.getFullYear(),
        },
      })
      .then(response => {
        setMonthAvailability(response.data);
      });
  }, [currentMonth, user.id]);

  useEffect(() => {
    api
      .get<AppointmentData[]>('/appointments/me', {
        params: {
          day: selectedDate.getDate(),
          month: selectedDate.getMonth() + 1,
          year: selectedDate.getFullYear(),
        },
      })
      .then(response => {
        const formattedAppointment = response.data.map(appointment => {
          return {
            ...appointment,
            formattedHour: format(parseISO(appointment.date), 'HH:mm'),
          };
        });
        setAppointments(formattedAppointment);
      });
  }, [selectedDate]);

  const disabledDays = useMemo(() => {
    const currentDate = new Date();

    const daysToDisable = monthAvailability
      .filter(monthDay => {
        const compareDate = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          monthDay.day,
        );
        return isAfter(currentDate, compareDate) && !isToday(compareDate);
      })
      .map(
        monthDay =>
          new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            monthDay.day,
          ),
      );

    return daysToDisable;
  }, [currentMonth, monthAvailability]);

  const selectedDateAsText = useMemo(() => {
    const monthDay = format(selectedDate, "'Dia' d");
    let month = format(selectedDate, 'MMMM', { locale: ptBR });
    let weekDay = format(selectedDate, "EEEE'-feira'", { locale: ptBR });

    month = month.charAt(0).toUpperCase() + month.slice(1);
    weekDay = weekDay.charAt(0).toUpperCase() + weekDay.slice(1);

    return {
      monthDay,
      month,
      weekDay,
    };
  }, [selectedDate]);

  const morningAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const currentDate = new Date();
      return (
        parseISO(appointment.date).getHours() < 13 &&
        isBefore(
          currentDate.setMonth(currentDate.getMonth()),
          parseISO(appointment.date),
        )
      );
    });
  }, [appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const currentDate = new Date();
      return (
        parseISO(appointment.date).getHours() > 12 &&
        isBefore(
          currentDate.setMonth(currentDate.getMonth()),
          parseISO(appointment.date),
        )
      );
    });
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    return appointments.find(appointment => {
      return isAfter(parseISO(appointment.date), new Date());
    });
  }, [appointments]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />
          <Link to="/profile">
            <Profile>
              <img src={user.avatar_url} alt="Fabio" />
              <div>
                <span>Bem vindo,</span>
                <strong>{user.name}</strong>
              </div>
            </Profile>
          </Link>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários Agendados</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateAsText.monthDay}</span>
            <span>{selectedDateAsText.month}</span>
            <span>{selectedDateAsText.weekDay}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Atendimento a seguir</strong>
              <div>
                <img src={nextAppointment?.user.avatar_url} alt="Client" />
                <strong>{nextAppointment?.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment?.formattedHour}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>

            {morningAppointments.length === 0 && (
              <p> Nenhum agendamento neste período.</p>
            )}

            {morningAppointments &&
              morningAppointments.map(appointment => (
                <Appointment key={appointment.id}>
                  <span>
                    <FiClock />
                    {appointment.formattedHour}
                  </span>

                  <div>
                    <img src={appointment.user.avatar_url} alt="NextClient" />
                    <strong>{appointment.user.name}</strong>
                  </div>
                </Appointment>
              ))}
          </Section>

          <Section>
            <strong>Tarde</strong>

            {afternoonAppointments.length === 0 && (
              <p> Nenhum agendamento neste período.</p>
            )}

            {afternoonAppointments &&
              afternoonAppointments.map(appointment => (
                <Appointment key={appointment.id}>
                  <span>
                    <FiClock />
                    {appointment.formattedHour}
                  </span>

                  <div>
                    <img src={appointment.user.avatar_url} alt="NextClient" />
                    <strong>{appointment.user.name}</strong>
                  </div>
                </Appointment>
              ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            onMonthChange={handleMonthChange}
            onDayClick={handleDateChange}
            selectedDays={selectedDate}
            months={[
              'Janeiro',
              'Feveiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
