// src/constants/panes.ts
export const dashboardPanes = [
  {
    title: 'New',
    content: [
      {
        title: 'Remove any exposure to my data stores with PII',
        details: 'Data | High',
        buttonText: 'Details'
      },
      {
        title: 'Log all non MFA logins',
        details: 'Identity | Medium',
        buttonText: 'Investigate'
      },
      {
        title: 'Patch vulnerability in MongoDB',
        details: 'Security | Critical',
        buttonText: 'Apply Patch'
      }
    ]
  },
  {
    title: 'Needs Input',
    content: [
      {
        title: 'Firewall rule review required on PAN-dmz-02-dallas',
        details: 'Security | Urgent',
        buttonText: 'Review'
      },
      {
        title: 'Approve Model Context Protocol proxy installation',
        details: 'Network | Medium',
        buttonText: 'Approve'
      }
    ]
  },
  {
    title: 'Handover',
    content: [
      {
        title: 'Disable public access to all S3 buckets',
        details: 'Identity | High',
        buttonText: 'Details'
      },
      {
        title: 'Prevent data exfil from Dev',
        details: 'Data | High',
        buttonText: 'Monitor'
      }
    ]
  },
  {
    title: 'Running',
    content: [
      {
        title: 'Prevent lateral move from subnet 10.10.5/24',
        details: 'Network | Medium',
        buttonText: 'Monitor'
      }
    ]
  },
  {
    title: 'Completed',
    content: [
      {
        title: 'Upgrade Firewall FW-Dallas-DMZ to latest version',
        details: 'Security | Urgent',
        buttonText: 'View Log'
      }
    ]
  }
];
