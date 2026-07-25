import { Contact, Message, CallLog, MediaItem, SecuritySettings } from '../types';

export const INITIAL_SETTINGS: SecuritySettings = {
  stealthMode: true,
  ghostVault: false,
  autoLockMinutes: 5,
  secretPin: '1234',
  messageDecay: false,
  darkMode: true,
  hapticFeedback: true,
  messageAlerts: true,
  cloudSync: true,
};

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ4XDXK27eDWsqqbyoYV37RTt2Z19B12IB73GRtFHTLlAhNbMUYyDdrs-zTZmDp0dhxuhrYzxQ_RHXguRBC5G3x7-gTLOzjmo596XifCII_nAYLBXyM1o7PLBu09dC8xWE3QLj-JwzAROLPRS30uuEqTRx98hNvgkV6wLGI8uZbnFCHrFoUsT7Pv_D1y9yCOd5RDlH32NoazX8eFiad6mhVE2P4dKNCifdEYwlf4TGRkgZJ0mxugZzJCE2crKekYMty9jP6JmF',
    statusText: 'Testing new algorithms',
    isOnline: true,
    isPinned: true,
    lastMessage: 'The new algorithm is ready for testing!',
    lastMessageTime: '10:42 AM',
    unreadCount: 2,
    phone: '+1 (555) 019-2834',
    categoryLetter: 'S',
  },
  {
    id: 'alex-rivera',
    name: 'Alex Rivera',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBl0ktFuvB6GR61Z1QpJdi9XFplnWRTA-Ne-fTVjYIwDgAwB-4GjNDG-Zgjg02gzF-fyJ47tm3knadv69FYrBqrTRyThkjg0kVOoNNHcNlGXa-UTQA-n1yxO39VqG4jzTX4sF8sSaCjVmkYPo5f5F_8gL1QnFeX46u2VDVo4iKO_yKhdXurxTS4FAYVFz8lR6AMMyTTPbb9Ph3p9mGbxiUbl0XAiw1gccbiT4XJRTNVinbLoeDuTnTUn-jd2VoTxc1Pu-ftLibq',
    statusText: 'Available',
    isOnline: true,
    isPinned: true,
    lastMessage: 'Sent workspace specs',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    phone: '+1 (555) 012-3456',
    categoryLetter: 'A',
  },
  {
    id: 'design-ops',
    name: 'Design Ops',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAA1zzL4GG0ccMOflx4WNf0_7Kels8X_rv9lQrR9rxyuroDtaZvoxt3e_CnmIxl7LDrJZ2-Yv4dsUEu1d8yTVGiMoUSZG_QV5488vC4waDuwAcwu5P0w-CzzCAaSm7JX1tLJBnSoAQU3ESpIIjR818sEPODdDno1dZ8lX4Z9MDoyfM3R416YbxJc74Y0a_rMKt2glCly72t6szve6CoHooD4YUpPiA_IFS4978xRkcLIaAtCtVQQ43OZEQeh0KYfz3mM0b8jVfJ',
    statusText: 'UI/UX Design Team',
    isOnline: false,
    isPinned: true,
    isGroup: true,
    groupMembersCount: 4,
    lastMessage: 'Updated Figma design system tokens.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    phone: 'GROUP-DESIGNOPS',
    categoryLetter: 'D',
  },
  {
    id: 'mia',
    name: 'Mia',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd7L7V1Vt-PzV5G00cal2qevb_ANCIMimjOApnRmL8m2Z62NqwtdjDIr8Oseexdvyq7M4kaole4svVf5UacjrdvfEtB1JeOpTLBlqdbRQEbkptxuZxt_hxpb9UE1PdwOQg3WltQZnON80ebgQqrxN8tDkwbtxQYZuGCq6qSyFhRpdzdVk_B-u2YYo0I8JoBbhe3kchqlr45TtjwWs2A_u3NyzJxsTdgwg92asLqfc11DuBesemUZBaw7XMQ3_qe5j_KDlmSfXD',
    statusText: 'Focusing...',
    isOnline: false,
    isPinned: true,
    lastMessage: 'See you at the tech sync.',
    lastMessageTime: 'Mar 23',
    unreadCount: 0,
    phone: '+1 (555) 432-8765',
    categoryLetter: 'M',
  },
  {
    id: 'marcus-thorne',
    name: 'Marcus Thorne',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTLRGMczxrxm_LsA9wgRU2hXISydX2S6XaR0lP7996B-19OOF2DjZOIiU6-plM-i41HACCCeE5h5GdzFcvlmCxyXXMBoEhW-eukPSXulX5-chkzilLbzPB2mmdCks7FDz7nGNlytQNk71kK5t1XaaCtwwVh12reZM4btyMWOfK6saNfADFoN72TFbbZehTpkiZabALF7YNZbxnY3LnqwZZbRYg6VkasAPWJSCUWban3t1gLM6yDKByc310i98lZG0U17qfw6uR',
    statusText: 'Busy in meeting',
    isOnline: true,
    isPinned: false,
    lastMessage: 'Sent a voice message',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    phone: '+1 (555) 987-6543',
    categoryLetter: 'M',
  },
  {
    id: 'global-dev-squad',
    name: 'Global Dev Squad 🚀',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzFYYMXnnDLfXxOSyqnWC8uKGlhozvPNfuthg0OCMYB8EHd0BwiWWoIzzUaHuFGumHCTFV4la7u-akHNovRbMbr_aNi1XvrOQI1lKfUSmLTB5ilzh75xSht4rGwuNlzSzhG3pa-KupZLgx-jq1iRBV7v-7ivJOVhmrJpLY_OfPGkq1LFYUAKEnFvn6Uv_Eket8Y2Taj0fIL6k0gl1Q0SfYVKOeOOZPeiqE7sPmhQaUlpisUeLftDummIBr3V4OY40ysq9qS6oy',
    statusText: '6 members, 2 online',
    isOnline: true,
    isPinned: false,
    isGroup: true,
    groupMembersCount: 6,
    lastMessage: 'Devin: Check the repo for the latest PR...',
    lastMessageTime: 'Mar 22',
    unreadCount: 0,
    phone: 'GROUP-DEV-SQUAD',
    categoryLetter: 'G',
  },
  {
    id: 'elena-rodriguez',
    name: 'Elena Rodriguez',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuwYtCtl8VKPKOyjgNHY_gvotZBvGKo_dp608_Kp1EWSfx7c4Glvx1Vidqkjwbuiy7HQiCdp_8ZsDMrQUkK3a2CtE7RqML4sLbzOusb2_VCmDvk-ctJ_DxapxOTYMnB4f5JJv_mCWUn_IZemMgZbHO57IjhbN2_ohKt1K6JcqX33Ppi28quNvcbAv7P7B4nxQmjRjg_5ZStY9MW5sto6MUz-fxHOX7mNCRJalkC-KQFhE_IJ5R6yfxNcUhpwFQ05WkOjcfpcHk',
    statusText: 'End-to-End Encrypted',
    isOnline: true,
    isPinned: false,
    lastMessage: 'Did you see the latest release notes?',
    lastMessageTime: 'Mar 21',
    unreadCount: 0,
    phone: '+1 (555) 777-8899',
    categoryLetter: 'E',
  },
  {
    id: 'tech-support',
    name: 'Tech Support',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBykRSIqkGhimD7foTVoodCyof48QC8B52Psa4PM_TecWvkAOOJsFPum6OCf8f6-buOIfswZh_hBc3PQQcYBKx4w1wPU2Q6bE3aAc3Sp9Kk5OuChiIU7nEcpmiQoPYO4pWjisD5pgMwPmJKNP0K0Bt5KD4jFf4Zj90e0Z_asmzNDS9syHHIaDFINXAGbQ-8gP42d9KoXkYbYUKRINMBDUXxfftPQ2GD17DbRLFteZp-m6S4SIIeRaFh6DTVL56kjaYxmAhIJ-kv',
    statusText: 'Automated Encryption Desk',
    isOnline: true,
    isPinned: false,
    lastMessage: 'Your ticket #8842 has been resolved.',
    lastMessageTime: 'Mar 20',
    unreadCount: 0,
    phone: 'SUPPORT-8842',
    categoryLetter: 'T',
  },
  {
    id: 'aaron-stark',
    name: 'Aaron Stark',
    avatarUrl: '',
    statusText: 'Available',
    isOnline: false,
    phone: '+1 (555) 234-5678',
    categoryLetter: 'A',
  },
  {
    id: 'alice-cooper',
    name: 'Alice Cooper',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDN3shggT18kJnOtNX7KQywPSnYQI5Csrh1OJdFBEpqlRfEXivgN9xGSy9QN8RDAJAMaNKLrMUSBsCTbbbt9PhbsAMrqUGq2b8VdT26sYm-HBskIWN0IQw8P4awBfk6OTs08C0IXJNKJnLk6XRRF08dNWjPkmkw-RqOiGNrFvTeVPIAIBZSAxENXDlsNexpCPf1AnZqbR8LJztMoD2aRL6VRC4zdYA4d9cLIZrudZPQQ_gJ9jboSUJcUY5f19uNYNaMPggwD9fo',
    statusText: 'Calculator Plus User',
    isOnline: true,
    phone: '+1 (555) 345-6789',
    categoryLetter: 'A',
  },
  {
    id: 'ben-parker',
    name: 'Ben Parker',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsI0OPNEwAivS-kDxbi7RqcNaw63C0859P5uBFtHBEeLOAsOdpj40CKuww4rNbdN2uYFgLJ-_HFJUmQqBPvacvVu89ZmCuxpAh8DI_txVASMFC5qi-a1dU8qOGubUCRC74gqRysGmUhtC0lL9bNJXQiQjylcQk0oB4ahSPUUtsNDwYJCN4qkjGKTd1mCGbLqSeqYmT9XKJg6XHsoiVG0_3hATwJ2vjb_B5RTTmyEFPhVR1porYAC6UAwC8GHFyKwrCu50CmIPl',
    statusText: 'In a meeting',
    isOnline: false,
    phone: '+1 (555) 456-7890',
    categoryLetter: 'B',
  },
  {
    id: 'blake-lawson',
    name: 'Blake Lawson',
    avatarUrl: '',
    statusText: 'Away',
    isOnline: false,
    phone: '+1 (555) 567-8901',
    categoryLetter: 'B',
  },
  {
    id: 'cara-dele',
    name: 'Cara Dele',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsAbAURV8F-zaRuHZpie8e54LJzKg-jkwSkfgEf-BSPZXDBzJjSp_Y5UfKCumjK4yDvUeIiGsNFNdOKiA8YoVRLEuphlOI-Hsd7E6San67AQL8MzIWDeqFmH_-WFbTPMZzPlXF0GWBfZlFvLiEyOY5aGVYPE-GTCt4RJPJbrkTObxjUVdYvUHaf49ewUHzcl5O-04oGpCrhDmRQmNAktkOIl0sBvDSTQaOTMNEyrkbXYdTNVNiP7MSbjyjEr6TndpgwnAw79y0',
    statusText: 'Available',
    isOnline: true,
    phone: '+1 (555) 678-9012',
    categoryLetter: 'C',
  },
  {
    id: 'julianne-vought',
    name: 'Julianne Vought',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBB9iYkSb9WO2gdBF6obHPSY8_nHlwvDLjmX2fL_ff2EAQEl5LTR_R-cjdcK8U6sPZMNFcxQ7Asq89rO4EDj6FmpqOlLmnbIuR_EDiHH1DCkM0_ZKYHq6AEjHIJ8LC9X0ZQMgPfiJICFt4m9AdEVwIDSCG6_gzyn3IzbjwUy7T7-Vexcut6hNb54dR0MvHEaPsKGowYyuZf1X6sA8FrCq5UX_vIRfaZwnFH1xgAxiM13gy2KSr2ZNqu4RAXNFBFEC8pR58Uw1p',
    statusText: 'Product Vice President',
    isOnline: true,
    phone: '+1 (555) 888-1122',
    categoryLetter: 'J',
  }
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  'elena-rodriguez': [
    {
      id: 'e1',
      senderId: 'elena-rodriguez',
      senderName: 'Elena Rodriguez',
      content: 'Hey! Have you finished the breakdown for the Q3 projections? I need the final numbers before the meeting. 📊',
      timestamp: '09:41 AM',
      isOutgoing: false,
      status: 'read'
    },
    {
      id: 'e2',
      senderId: 'user',
      senderName: 'You',
      content: "Almost there. Just verifying the hardware margins. I'll send over the image preview in a second.",
      timestamp: '09:42 AM',
      isOutgoing: true,
      status: 'read'
    },
    {
      id: 'e3',
      senderId: 'user',
      senderName: 'You',
      content: '',
      timestamp: '09:43 AM',
      isOutgoing: true,
      status: 'read',
      attachment: {
        type: 'image',
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYtpS3My2KFXiV04wJablTH4-5-e8i4zcQairl8jFh1m7UU8mfB4voPBIDUX4fyOsPPMq8kmunmyq3wgjVCujVl7RKFHG1gqwUdX6jmMtfIikevsHnUxyDbKBifo1lp2Kuv4KOPSF7Z_sGHtv76qnQEyie4tdHY8O9CeyADdYrTvu4OROCUvQu5iR5CyEv4yLH-IvlQ-ijea4m-K7u96HSzc7tqJhwg6UH5QMa-7ySCNyWrRf-PBod2cSrbnUj03xdVwesqR-o',
        fileName: 'q3_analytics_dashboard.png',
        fileSize: '1.8 MB'
      }
    },
    {
      id: 'e4',
      senderId: 'elena-rodriguez',
      senderName: 'Elena Rodriguez',
      content: 'Voice message audio',
      timestamp: '09:44 AM',
      isOutgoing: false,
      status: 'read',
      attachment: {
        type: 'voice',
        duration: '0:24'
      }
    }
  ],
  'global-dev-squad': [
    {
      id: 'g1',
      senderId: 'sarah-chen',
      senderName: 'Sarah Chen',
      content: 'Just pushed the initial design system assets for the new project. Take a look at these renders!',
      timestamp: '10:42 AM',
      isOutgoing: false,
      status: 'read',
      attachment: {
        type: 'image',
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxrxm90eppsqW7Y3qeQVLHOcNFDkB4mBf8AWsjQR4_3pRl0CbzlvZk8UxelQcAs5Qe5LX_VbjyqqUAko89lYyNATpHXwz_WzVZ0cuh5q0oVYr2LyTZ8OBupPPrdoQTS8TmqSfS1Konj00zk9hdPXyjm_AP4WSpMO2QvUJ7QygynKRpXXiUbQTGkXgR7Iy1CzHGp-KPYg9Mik8_YXDWbptFKt5flc8ek-afLnK4zkrNcAOP2XRr5q1B15HT5oFgE4Ue0E6aiTYo',
        fileName: '5_shared_renders.zip',
        fileSize: '12 MB'
      }
    },
    {
      id: 'g2',
      senderId: 'poll-1',
      senderName: 'Dev Squad Poll',
      content: '',
      timestamp: '10:50 AM',
      isOutgoing: false,
      status: 'read',
      poll: {
        id: 'poll-lunch',
        question: 'Lunch choice?',
        totalVotes: 18,
        options: [
          { id: 'opt-1', text: 'Sushi Bar', votes: 5, votedUserIds: [] },
          { id: 'opt-2', text: 'Pizza Palace', votes: 12, votedUserIds: ['user'] },
          { id: 'opt-3', text: 'Salad Box', votes: 1, votedUserIds: [] }
        ]
      }
    },
    {
      id: 'g3',
      senderId: 'marcus-aurelius',
      senderName: 'Marcus Aurelius',
      content: 'Check out this new component library. It perfectly matches our Midnight Tech theme!',
      timestamp: '11:05 AM',
      isOutgoing: false,
      status: 'read'
    },
    {
      id: 'g4',
      senderId: 'user',
      senderName: 'You',
      content: "This looks exactly like what we need. Let's integrate it for the settings panel first.",
      timestamp: '11:12 AM',
      isOutgoing: true,
      status: 'read'
    }
  ],
  'sarah-jenkins': [
    {
      id: 'sj-1',
      senderId: 'sarah-jenkins',
      senderName: 'Sarah Jenkins',
      content: 'The new algorithm is ready for testing!',
      timestamp: '10:42 AM',
      isOutgoing: false,
      status: 'delivered'
    }
  ]
};

export const INITIAL_CALL_LOGS: CallLog[] = [
  {
    id: 'call-1',
    contactId: 'julianne-vought',
    contactName: 'Julianne Vought',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBB9iYkSb9WO2gdBF6obHPSY8_nHlwvDLjmX2fL_ff2EAQEl5LTR_R-cjdcK8U6sPZMNFcxQ7Asq89rO4EDj6FmpqOlLmnbIuR_EDiHH1DCkM0_ZKYHq6AEjHIJ8LC9X0ZQMgPfiJICFt4m9AdEVwIDSCG6_gzyn3IzbjwUy7T7-Vexcut6hNb54dR0MvHEaPsKGowYyuZf1X6sA8FrCq5UX_vIRfaZwnFH1xgAxiM13gy2KSr2ZNqu4RAXNFBFEC8pR58Uw1p',
    type: 'voice',
    direction: 'incoming',
    timestamp: 'Today, 04:14 PM',
    duration: '04:14'
  },
  {
    id: 'call-2',
    contactId: 'sarah-jenkins',
    contactName: 'Sarah Jenkins',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC54K0HiR1MgWdtwmbVoXlVWZ4S9mbRACYJN7Ua36QMO8GqFaQacqX9yKq8dp3Pdz5nEC_SxNNXXS-0pepZfLrbcOAgvypwb8b8ccHNETNJxG4x1n4f_pZeb3Gn8_pnjseIaS7KGrTuEdxFOr0Plw7s7Juuh3u8ZJJ-TlTkl77X5W4_5b3QEG---PGgbIJ83w_NuQ8XRj3mgjAiJDoFSBSNCAO_NhfzrFA2KsrZ0JnHschnxneEB0AF12jC1qhBy6PgkTop-QEN',
    type: 'video',
    direction: 'outgoing',
    timestamp: 'Today, 12:44 PM',
    duration: '12:44'
  },
  {
    id: 'call-3',
    contactId: 'marcus-thorne',
    contactName: 'Marcus Thorne',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTLRGMczxrxm_LsA9wgRU2hXISydX2S6XaR0lP7996B-19OOF2DjZOIiU6-plM-i41HACCCeE5h5GdzFcvlmCxyXXMBoEhW-eukPSXulX5-chkzilLbzPB2mmdCks7FDz7nGNlytQNk71kK5t1XaaCtwwVh12reZM4btyMWOfK6saNfADFoN72TFbbZehTpkiZabALF7YNZbxnY3LnqwZZbRYg6VkasAPWJSCUWban3t1gLM6yDKByc310i98lZG0U17qfw6uR',
    type: 'voice',
    direction: 'missed',
    timestamp: 'Yesterday, 09:15 PM'
  }
];

export const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'm1',
    title: 'night_city_01.jpg',
    type: 'images',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDU9mHnPf0sRlYy1wucSr7fHXJjIMUENbcZcEalcZV2FvZXmiZbOhiQlCAjqWwmV86Cte1WFC5k9H2_eKB6kSNnuT7YK7EigtutgbnNgYM2VSvDn-Tqr-V1-bzYp5Qd9zAqS19CUdvkBwtuN7hIFNbF5mbv-TO3_Xq0RtpP79OPMsrPcPvXpy2E4idke1cY2XLlmxzZUyivky2M9oPeI7iEdyQ-xDqR9CFWhnoGYjvDXgw4CP8vO3YQYUtkwcjg1Qg5tuHtIUNJ',
    fileSize: '4.2 MB',
    timestamp: 'Today, 10:12 AM',
    senderName: 'Sarah Chen'
  },
  {
    id: 'm2',
    title: 'precision_watch_movement.jpg',
    type: 'images',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqNQ9YbJUVRTV6tCgTdNbgl-9SFEeRt_ZrmMMZEaFA0mjCUdi4ZDxYFIbQIt6g1vSL-rc16JNguvy10ffXydxU17CFS2w2PX3AoXPSrOHJEX26G0ZGBVnOcoh64by-Z2tcViP1UWFIUJeU7mahLx1MyNTIUBEBv3fFN_WL5LAYnTZ5AehBM0Z5rezpyEpJHvfif8x9qrj9pE6Nlm92Z8OKhUDjG6GsBHtv3goKx2gjAQciMclrGesEyFzSP2hf1B5jlE4lMU3_',
    fileSize: '3.1 MB',
    timestamp: 'Yesterday, 08:30 PM',
    senderName: 'Marcus Thorne'
  },
  {
    id: 'm3',
    title: 'liquid_metal_3d.png',
    type: 'images',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGa3b9zmNBNi_KnXpbpQm4N-RqgI1qCk_WgVEFUfP69BKkz9NeF2CI7fVkfoIKG0RvS7R3-xnSxyqdEOxf-Y7Fey7U-c7G24oZpwUQvnZ2ZdEDe60gRAzZTrVHdsuaTExK-UziaKqDAurGUuaCsGHyXlIilGq2MMGakT_G86vRSiVulGNDkE0_9EF7t7KwCQvqrXpN9-8REOus8HsNARO9o0xRFShn0JvquN5bLH35i1A2a3KqtHfrQ-Fv-zx_DaKmA2ny9YOA',
    fileSize: '5.8 MB',
    timestamp: 'Mar 23',
    senderName: 'Alex Rivera'
  },
  {
    id: 'm4',
    title: 'quantum_server_rack.jpg',
    type: 'images',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3wFU-u8EGAYtJCPBIwi40EyGxc0CASdShV8eSOBrYYsRdfqi7XRtbQLfn6HkKDR--2xQ3j5hFxU8x32_X-0F6Jnl8R3rAURNhxWzL_OvZhroTU-rNuNfnUVcVZIIhXV0EPR7eukrqWGu7ab9Gn3I9j46lJreAJ1_3ZGYhYtVmpyJ8LjDytI5wbfHk3GGfXxk-cCX9l2SXWjW6D-DiKbCfZMalEzNPfgNONBRbdDCASr0fi1V8qxHlo6Z_xRM3sGhUVFkg6Q5z',
    fileSize: '2.9 MB',
    timestamp: 'Mar 22',
    senderName: 'Global Dev Squad'
  },
  {
    id: 'm5',
    title: 'setup_inspiration.png',
    type: 'images',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3ZVseHhifnVPgocap8FQTxUyaEtnrHRzwEbj2poO7sHz75U2DEp3AXijwrvunJKNeXLl1yrHBzTDB0VcDTJfcK52_4tiX62VaFpZOCByyt5OyMXBthzJAoZZOv65QxqlbgRTDmFYcAQXlUqDugHixIwwxO1uD0Ht9wROxb83wELXzJOAiuSMVa9iT0mfX1qJTvpfKjnVXEF215Kbf0XjXcWYb0-_uZHZR-yg-tQwSWzWk_vCpbB_UCd20A-R-9UJod226dtUv',
    fileSize: '6.1 MB',
    timestamp: 'Mar 21',
    senderName: 'Julianne Vought'
  },
  {
    id: 'm6',
    title: 'brutalist_facade.jpg',
    type: 'images',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTyGTJOjuy74X5xxzjExfKkHM5lzoj1Ym9vENm1xbPxpo8OqmtUkfO334SfVKLugdObJiWZhUiOYO_6phk5v2DYSRMzo4VvoKuzN7kDhW257c6U8c5w9m_QEq4dPbMzpKI2ZQTFjg_XUJW9092qYdmiziJjgBMMqTB9QJnFNFl3S2jm1aWNwUM7RnPqVuOouSJIPhB65T23BHOlPfXLuBRLFHpOff_59S00wpMrvb7rzT_40ocw4kaESngCQvF-tKwZMxQzxUE',
    fileSize: '3.7 MB',
    timestamp: 'Mar 20',
    senderName: 'Elena Rodriguez'
  },
  {
    id: 'd1',
    title: 'Yearly_Revenue_Report.pdf',
    type: 'documents',
    url: '#',
    fileSize: '2.4 MB',
    timestamp: 'Nov 12, 2023',
    senderName: 'Tech Support'
  },
  {
    id: 'd2',
    title: 'Project_Specs_V2.docx',
    type: 'documents',
    url: '#',
    fileSize: '840 KB',
    timestamp: 'Yesterday',
    senderName: 'Sarah Jenkins'
  }
];
