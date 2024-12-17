import { transformProposedDates } from "@/lib/format-date";
import api from "..";

export const getEventsHrApi = async (token: string) => {
  try {
    const response = await api.get(`/event/hr`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const postEventsHrApi = async (
  token: string,
  body: UpdateEventHrType | undefined,
) => {
  try {
    const response = await api.post(`/event/hr`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const putEventsHrApi = async (
  token: string,
  eventId: string | undefined,
  body: UpdateEventHrType | undefined,
) => {
  try {
    const response = await api.put(`/event/hr/${eventId}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const deleteEventsHrApi = async (
  token: string,
  eventId: string | undefined,
) => {
  try {
    const response = await api.delete(`/event/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

// vendor api

export const getEventsVendorApi = async (token: string) => {
  try {
    const response = await api.get(`/event/vendor`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const rejectEventVendorApi = async (
  token: string,
  eventId: string | undefined,
  body: RejectEventVendorType | undefined,
) => {
  try {
    const response = await api.patch(`/event/vendor/reject/${eventId}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const acceptEventVendorApi = async (
  token: string,
  eventId: string | undefined,
  body: AcceptEventVendorType | null | undefined,
) => {
  try {
    const response = await api.patch(`/event/vendor/${eventId}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};
