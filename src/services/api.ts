import axios from "axios";
import {
  OrganizationMembership,
  Person,
  Service,
  TimeEntry,
  TimeEntryParams,
} from "../types";

const API_URL = "https://api.productive.io/api/v2";
export const TOKEN = "6b382640-22c9-403e-b343-af222c037957";
export const ORGANIZATION_ID = "44704";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "X-Auth-Token": TOKEN,
    "X-Organization-Id": ORGANIZATION_ID,
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
  },
});

interface OrganizationMembershipDto {
  data: OrganizationMembership[];
  included: Person[];
}

interface ServiceDto {
  data: Service[];
}

interface TimeEntryDto {
  data: TimeEntry[];
  included: Service[];
}

interface TimeEntryUpdateDto {
  data: {
    type: string;
    attributes: {
      date: string;
      note?: string;
      time?: number;
    };
    relationships?: {
      service?: {
        data: {
          type: string;
          id: string;
        };
      };
    };
  };
}

export const api = {
  async getOrganizationMemberships() {
    const response = await axiosInstance.get<OrganizationMembershipDto>(
      "/organization_memberships?include=person"
    );

    const { data, included } = response.data;

    const personsMap = new Map(
      included
        ?.filter((item: Person) => item.type === "people")
        .map((person: Person) => [person.id, person])
    );

    return data.map((entry: OrganizationMembership) => ({
      ...entry,
      person: entry.relationships.person?.data?.id
        ? personsMap.get(entry.relationships.person.data.id)
        : null,
    }));
  },

  async getServices() {
    const response = await axiosInstance.get<ServiceDto>("/services");
    return response.data.data;
  },

  async getTimeEntries(personId?: string, date?: string, serviceId?: string) {
    let url = `/time_entries`;
    const params = new URLSearchParams();

    params.append("include", "service");

    if (personId) {
      params.append("filter[person_id]", personId);
    }

    if (date) {
      params.append("filter[after]", date);
      params.append("filter[before]", date);
    }

    if (serviceId) {
      params.append("filter[service_id]", serviceId);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await axiosInstance.get<TimeEntryDto>(url);
    const { data, included } = response.data;

    const servicesMap = new Map(
      included
        ?.filter((item: Service) => item.type === "services")
        .map((service: Service) => [service.id, service])
    );

    return data.map((entry: TimeEntry) => ({
      ...entry,
      service: entry.relationships?.service?.data?.id
        ? servicesMap.get(entry.relationships.service.data.id)
        : null,
    }));
  },

  async addTimeEntry(
    entry: TimeEntryParams,
    service_id: string,
    person_id: string
  ) {
    const { date, note, time } = entry.attributes;

    const response = await axiosInstance.post("/time_entries?include=service", {
      data: {
        type: "time_entries",
        attributes: {
          date: date,
          note: note,
          time: time,
        },
        relationships: {
          person: {
            data: {
              type: "people",
              id: person_id,
            },
          },
          service: {
            data: {
              type: "services",
              id: service_id,
            },
          },
        },
      },
    });

    const { data, included } = response.data;

    const servicesMap = new Map(
      included
        ?.filter((item: Service) => item.type === "services")
        .map((service: Service) => [service.id, service])
    );

    return {
      ...data,
      service: servicesMap.get(service_id) || null,
    };
  },

  async updateTimeEntry(entry: TimeEntry, service_id?: string) {
    const id = entry.id;
    const { date, note, time } = entry.attributes;

    const requestData: TimeEntryUpdateDto = {
      data: {
        type: "time_entries",
        attributes: {
          date: date,
          note: note,
          time: time,
        },
      },
    };

    if (service_id) {
      requestData.data.relationships = {
        service: {
          data: {
            type: "services",
            id: service_id,
          },
        },
      };
    }

    const response = await axiosInstance.patch(
      `/time_entries/${id}?include=service`,
      requestData
    );

    const { data, included } = response.data;

    const servicesMap = new Map(
      included
        ?.filter((item: Service) => item.type === "services")
        .map((service: Service) => [service.id, service])
    );

    if (service_id) {
      return {
        ...data,
        service: servicesMap.get(service_id) || null,
      };
    } else {
      return {
        ...data,
        service: servicesMap.get(data.relationships.service.data.id) || null,
      }
    }
  },

  async deleteTimeEntry(id: string) {
    await axiosInstance.delete(`/time_entries/${id}`);
    return id;
  },
};
