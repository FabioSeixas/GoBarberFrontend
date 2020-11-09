import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { isToday, format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { FiClock, FiPower } from 'react-icons/fi';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

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
}

interface AppointmentData {
  id: string;
  date: string;
  user: {
    avatar: string;
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
    if (modifiers.available) {
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
      .get('/appointments/me', {
        params: {
          day: selectedDate.getDate(),
          month: selectedDate.getMonth() + 1,
          year: selectedDate.getFullYear(),
        },
      })
      .then(response => {
        response.data.forEach((appointment: AppointmentData) => {
          const parsedDate = parseISO(appointment.date);
          Object.assign(appointment, { date: format(parsedDate, "HH':00'") });
        });
        setAppointments(response.data);
      });
  }, [selectedDate]);

  const disabledDays = useMemo(() => {
    const daysToDisable = monthAvailability
      .filter(monthDay => !monthDay.available)
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

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />
          <Profile>
            <img src={user.avatar_url} alt="Fabio" />
            <div>
              <span>Bem vindo,</span>
              <strong>{user.name}</strong>
            </div>
          </Profile>

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

          <NextAppointment>
            <strong>Atendimento a seguir</strong>
            <div>
              <img src={user.avatar_url} alt="Client" />
              <strong>{user.name}</strong>
              <span>
                <FiClock />
                08:00
              </span>
            </div>
          </NextAppointment>

          <Section>
            <strong>Manhã</strong>
            {appointments &&
              appointments.map(appointment => (
                <Appointment key={appointment.id}>
                  <span>
                    <FiClock />
                    {appointment.date}
                  </span>

                  <div>
                    <img src={appointment.user.avatar} alt="NextClient" />
                    <strong>{appointment.user.name}</strong>
                  </div>
                </Appointment>
              ))}
          </Section>

          <Section>
            <strong>Tarde</strong>

            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>

              <div>
                <img src={user.avatar_url} alt="NextClient" />
                <strong>{user.name}</strong>
              </div>
            </Appointment>

            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>

              <div>
                <img src={user.avatar_url} alt="NextClient" />
                <strong>{user.name}</strong>
              </div>
            </Appointment>
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
