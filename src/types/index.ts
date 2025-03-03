export type OrganizationMembership = {
  id: string;
  type: string;
  attributes: object;
  relationships: {
    person: {
      data: {
        id: string;
      };
    };
  };
}

export type Person = {
  id: string;
  type: string;
  attributes: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export type Service = {
  id: string;
  type: string;
  attributes: {
    name: string;
  };
};

export type TimeEntry = {
  id: string;
  attributes: {
    date: string,
    time: number,
    note?: string,
    created_at: string,
    started_at?: string
    updated_at?: string
  };
  service?: Service | null;
  relationships?: {
    service?: {
      data: {
        id: string;
      };
    };
  };
};

export type TimeEntryParams = {
  attributes: {
    date: string,
    time?: number,
    note?: string,
    created_at?: string,
    started_at?: string
  }
};
