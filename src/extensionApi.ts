/*
 * Copyright 2021 Cortex Applications, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { EntityFilterGroup } from './filters';
import { Entity } from '@backstage/catalog-model';

type CortexSlackOwner = { type: string; channel: string; notificationsEnabled?: boolean; description?: string; };
type CortexEmailOwner = { type: string; email: string; description?: string; };
type CortexGroupOwner = { type: string; name: string; provider?: string; description?: string; };
type CortexOwner = CortexEmailOwner | CortexGroupOwner | CortexSlackOwner;
type OncallProvider = 'pagerduty' | 'opsgenie' | 'victorops';
type DataDogServiceTags = { tag: string; value: string };

export type CortexYaml = {
  title: string;
  description?: string;
  'x-cortex-link'?: {
    name: string;
    type: string;
    url: string;
    description?: string;
  }[];
  'x-cortex-service-groups'?: string[];
  'x-cortex-git'?: {
    github?: {
      repository: string;
      basePath?: string;
    };
    gitlab?: {
      repository: string;
      basePath?: string;
    };
    bitbucket?: {
      repository: string;
    };
    azure?: {
      project: string;
      repository : string;
      basePath?: string;
    };
  };
  'x-cortex-oncall'?: {
    [provider in OncallProvider]?: {
      id: string;
      type: string;
    };
  };
  'x-cortex-owners'?: CortexOwner[];
  'x-cortex-custom-metadata'?: {
    [key: string]: any | {
      value: any;
      description?: string;
    };
  };
  'x-cortex-k8s'?: {
    deployment?: {
      identifier: string;
      cluster?: string;
    }[];
  };
  'x-cortex-infra'?: {
    aws?: {
      ecs?: {
        clusterArn: string;
        serviceArn: string;
      };
    };
  };
  'x-cortex-apm'?: {
    newrelic?: {
      applicationId: string;
    };
    datadog?: {
      monitors?: number[];
      serviceTags?: DataDogServiceTags[];
      serviceName?: string;
    };
  };
  'x-cortex-slos'?: {
    signalfx?: {
      query: string;
      rollup: string;
      target: string;
      lookback: string;
      operation: string;
    }[];
    lightstep?: {
      streamId: string;
      targets: {
        latency: {
          percentile: number;
          target: number;
          slo: number;
        }[];
      };
    }[];
    datadog?: {
      id: string;
    }[];
  };
  'x-cortex-issues'?: {
    jira?: {
      labels: string[];
    };
  };
  'x-cortex-sentry'?: {
    project: string;
  };
  'x-cortex-bugsnag'?: {
    project: string;
  };
  'x-cortex-static-analysis'?: {
    sonarqube?: {
      project: string;
    };
  };
  'x-cortex-snyk'?: {
    projects?: {
      organizationId: string;
      projectId: string;
    }[];
  };
  'x-cortex-alerts'?: {
    type: string;
    tag: string;
    value: string;
  }[];
};

export type CustomMapping = (entity: Entity) => Partial<CortexYaml>;

interface EmailMember {
  name: string;
  email: string;
  description?: string;
}

interface Team {
  teamTag: string;
  name: string;
  shortDescription?: string;
  fullDescription?: string;
  links?: {
    name: string;
    type: string;
    url: string;
    description?: string;
  }[];
  slackChannels?: {
    name: string;
    notificationsEnabled: boolean;
  }[];
  emailMembers?: EmailMember[];
  additionalMembers?: EmailMember[];
}

interface Relationship {
  parentTeamTag: string;
  childTeamTag: string;
}

export interface TeamOverrides {
  teams: Team[];
  relationships: Relationship[];
}

export interface Rule {
  id: number;
  expression: string;
  title?: string;
  description?: string;
  failureMessage?: string;
  dateCreated?: string;
  weight: number;
}

export interface Group {
  id: string;
  tag: string;
}

export interface Scorecard {
  creator: {
    name: string;
    email: string;
  };
  id: number;
  name: string;
  description?: string;
  rules: Rule[];
  tags: Group[];
  excludedTags: Group[];
  filterQuery?: string;
  nextUpdated?: string;
}

export interface UiExtensions {
  scorecards?: {
    /**
     * Override default sort order of Scorecards in both the global and entity list view of Scorecards.
     */
    sortOrder?: {
      compareFn: (a: Scorecard, b: Scorecard) => number;
    }
  }
}

export interface ExtensionApi {
  /**
   * Additional filters on Entities for scorecards and initiatives
   */
  getAdditionalFilters?(): Promise<EntityFilterGroup[]>;

  /**
   * Override default UI for @cortexapps/backstage-plugin
   */
  getUiExtensions?(): Promise<UiExtensions>;

  /**
   * Override default mapping to Cortex YAMLs. Can be used to map custom fields without the need
   * to pollute Backstage descriptors with Cortex fields.
   *
   * List of Cortex annotations can be found here: https://docs.getcortexapp.com/service-descriptor/
   *
   */
  getCustomMappings?(): Promise<CustomMapping[]>;

  /**
   * Override default teams and team hierarchies in Cortex.
   * Can be used to fine tune where team information should come from, as well as particular team metadata.
   */
  getTeamOverrides?(entities: Entity[]): Promise<TeamOverrides>;
}
