/**
 * Basic Network for Trainee - Interactive Learning Platform
 * Author: Panthakit Totid / Network Training Curriculum
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSidebar();
  initScrollSpy();
  initSearch();
  initSubnetCalculator();
  initCLISimulator();
  initEncapsulationVisualizer();
  initQuiz();
  initCodeCopy();
});

/* ==========================================================================
   1. Theme Management (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('bnt_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('bnt_theme', next);
      updateThemeIcon(next);
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#themeToggle i, #themeToggle .theme-icon');
  if (icon) {
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

/* ==========================================================================
   2. Sidebar & Mobile Navigation
   ========================================================================== */
function initSidebar() {
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('appSidebar');

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });

    // Close sidebar when clicking a link on mobile
    const sidebarLinks = sidebar.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 860) {
          sidebar.classList.remove('open');
        }
      });
    });

    // Close when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 860 && sidebar.classList.contains('open')) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
          sidebar.classList.remove('open');
        }
      }
    });
  }
}

/* ==========================================================================
   3. ScrollSpy (Active Navigation Link on Scroll)
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.sidebar-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   4. Search & Filter
   ========================================================================== */
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.content-card, .module-section');

    if (!query) {
      cards.forEach(c => c.style.display = '');
      return;
    }

    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (text.includes(query)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

/* ==========================================================================
   5. Interactive IPv4 Subnet Calculator
   ========================================================================== */
function initSubnetCalculator() {
  const ipInput = document.getElementById('calcIp');
  const cidrSelect = document.getElementById('calcCidr');
  const btnCalculate = document.getElementById('btnCalculate');

  // Populate CIDR dropdown /1 to /32
  if (cidrSelect && cidrSelect.options.length <= 1) {
    cidrSelect.innerHTML = '';
    for (let i = 1; i <= 32; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `/${i} (${cidrToMask(i)})`;
      if (i === 24) opt.selected = true;
      cidrSelect.appendChild(opt);
    }
  }

  function runCalc() {
    const ipStr = ipInput ? ipInput.value.trim() : '192.168.1.100';
    const cidr = parseInt(cidrSelect ? cidrSelect.value : '24', 10);
    const result = calculateSubnet(ipStr, cidr);

    if (result.error) {
      alert(result.error);
      return;
    }

    document.getElementById('resNetId').textContent = result.networkId;
    document.getElementById('resBroadcast').textContent = result.broadcastId;
    document.getElementById('resMask').textContent = result.subnetMask;
    document.getElementById('resWildcard').textContent = result.wildcardMask;
    document.getElementById('resHostRange').textContent = `${result.firstHost} - ${result.lastHost}`;
    document.getElementById('resTotalHosts').textContent = result.totalHosts.toLocaleString();
    document.getElementById('resUsableHosts').textContent = result.usableHosts.toLocaleString();
    document.getElementById('resClass').textContent = `${result.ipClass} (${result.ipType})`;
    document.getElementById('resBinaryIp').textContent = result.binaryIp;
    document.getElementById('resBinaryMask').textContent = result.binaryMask;
  }

  if (btnCalculate) {
    btnCalculate.addEventListener('click', runCalc);
  }
  if (ipInput) {
    ipInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') runCalc();
    });
  }
  if (cidrSelect) {
    cidrSelect.addEventListener('change', runCalc);
  }

  // Run on initial load
  runCalc();
}

function cidrToMask(cidr) {
  const mask = [];
  for (let i = 0; i < 4; i++) {
    const n = Math.min(cidr, 8);
    mask.push(256 - Math.pow(2, 8 - n));
    cidr -= n;
  }
  return mask.join('.');
}

function calculateSubnet(ipStr, cidr) {
  const parts = ipStr.split('.');
  if (parts.length !== 4) return { error: 'รูปแบบ IPv4 ไม่ถูกต้อง (ต้องมี 4 octet เช่น 192.168.1.1)' };

  const octets = [];
  for (let p of parts) {
    const num = parseInt(p, 10);
    if (isNaN(num) || num < 0 || num > 255) {
      return { error: 'ค่า Octet ต้องอยู่ระหว่าง 0 - 255' };
    }
    octets.push(num);
  }

  const ipInt = (octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3];
  const maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  const wildcardInt = ~maskInt >>> 0;

  const netInt = (ipInt & maskInt) >>> 0;
  const bcastInt = (netInt | wildcardInt) >>> 0;

  const totalHosts = Math.pow(2, 32 - cidr);
  let usableHosts = totalHosts > 2 ? totalHosts - 2 : (totalHosts === 2 ? 2 : 1);

  const firstHostInt = cidr >= 31 ? netInt : netInt + 1;
  const lastHostInt = cidr >= 31 ? bcastInt : bcastInt - 1;

  // Determine Class
  let ipClass = 'Class A';
  if (octets[0] >= 128 && octets[0] <= 191) ipClass = 'Class B';
  else if (octets[0] >= 192 && octets[0] <= 223) ipClass = 'Class C';
  else if (octets[0] >= 224 && octets[0] <= 239) ipClass = 'Class D (Multicast)';
  else if (octets[0] >= 240) ipClass = 'Class E (Experimental)';

  // Determine Public / Private (RFC 1918)
  let ipType = 'Public IP';
  if (octets[0] === 10) ipType = 'Private RFC 1918 (10.0.0.0/8)';
  else if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ipType = 'Private RFC 1918 (172.16.0.0/12)';
  else if (octets[0] === 192 && octets[1] === 168) ipType = 'Private RFC 1918 (192.168.0.0/16)';
  else if (octets[0] === 127) ipType = 'Loopback (127.0.0.0/8)';
  else if (octets[0] === 169 && octets[1] === 254) ipType = 'APIPA (Link-Local)';

  return {
    networkId: intToIp(netInt),
    broadcastId: intToIp(bcastInt),
    subnetMask: intToIp(maskInt),
    wildcardMask: intToIp(wildcardInt),
    firstHost: intToIp(firstHostInt),
    lastHost: intToIp(lastHostInt),
    totalHosts,
    usableHosts,
    ipClass,
    ipType,
    binaryIp: octets.map(o => o.toString(2).padStart(8, '0')).join('.'),
    binaryMask: intToBinaryString(maskInt)
  };
}

function intToIp(int) {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255
  ].join('.');
}

function intToBinaryString(int) {
  const o1 = ((int >>> 24) & 255).toString(2).padStart(8, '0');
  const o2 = ((int >>> 16) & 255).toString(2).padStart(8, '0');
  const o3 = ((int >>> 8) & 255).toString(2).padStart(8, '0');
  const o4 = (int & 255).toString(2).padStart(8, '0');
  return `${o1}.${o2}.${o3}.${o4}`;
}

/* ==========================================================================
   6. Cisco IOS CLI Simulator
   ========================================================================== */
function initCLISimulator() {
  const body = document.getElementById('terminalBody');
  const promptEl = document.getElementById('terminalPrompt');
  const inputEl = document.getElementById('terminalInput');
  const chips = document.querySelectorAll('.cli-chip');

  if (!inputEl) return;

  let state = {
    hostname: 'Switch',
    mode: 'privileged', // 'user', 'privileged', 'global', 'config-if', 'config-vlan'
    history: [],
    historyIdx: -1
  };

  function updatePrompt() {
    if (state.mode === 'user') promptEl.textContent = `${state.hostname}>`;
    else if (state.mode === 'privileged') promptEl.textContent = `${state.hostname}#`;
    else if (state.mode === 'global') promptEl.textContent = `${state.hostname}(config)#`;
    else if (state.mode === 'config-if') promptEl.textContent = `${state.hostname}(config-if)#`;
    else if (state.mode === 'config-vlan') promptEl.textContent = `${state.hostname}(config-vlan)#`;
  }

  function appendOutput(cmd, output) {
    const div = document.createElement('div');
    div.className = 'terminal-output';
    div.innerHTML = `<span style="color: #60a5fa">${promptEl.textContent} ${escapeHtml(cmd)}</span>\n${output}`;
    body.insertBefore(div, inputEl.parentElement);
    body.scrollTop = body.scrollHeight;
  }

  function handleCommand(cmdRaw) {
    const cmd = cmdRaw.trim();
    if (!cmd) return;

    state.history.push(cmd);
    state.historyIdx = state.history.length;

    const lower = cmd.toLowerCase();

    // Built-in commands & Navigation
    if (lower === 'clear') {
      const outputs = body.querySelectorAll('.terminal-output');
      outputs.forEach(o => o.remove());
      return;
    }

    if (lower === 'help' || lower === '?') {
      appendOutput(cmd, 
`Commands available in this simulator:
  enable (en)                 - Enter Privileged Exec Mode
  disable                     - Return to User Exec Mode
  configure terminal (conf t) - Enter Global Configuration Mode
  hostname <name>             - Change device hostname
  interface <name>            - Enter Interface config mode
  exit / end                  - Exit current mode
  show ip int brief (sh ip int bri)
  show ip route
  show vlan brief
  show interfaces trunk
  show etherchannel summary
  show ip ospf neighbor
  show standby brief
  show access-lists
  test cable-diagnostics tdr interface <port>
  show cable-diagnostics tdr interface <port>
  clear                       - Clear terminal screen`);
      return;
    }

    // Mode transitions
    if (lower === 'enable' || lower === 'en') {
      state.mode = 'privileged';
      updatePrompt();
      appendOutput(cmd, '');
      return;
    }
    if (lower === 'disable') {
      state.mode = 'user';
      updatePrompt();
      appendOutput(cmd, '');
      return;
    }
    if (lower === 'configure terminal' || lower === 'conf t') {
      if (state.mode === 'user') {
        appendOutput(cmd, '% Unknown command or not in Privileged mode. Type "enable" first.');
        return;
      }
      state.mode = 'global';
      updatePrompt();
      appendOutput(cmd, 'Enter configuration commands, one per line. End with CNTL/Z.');
      return;
    }
    if (lower.startsWith('hostname ') || lower.startsWith('ho ')) {
      if (state.mode.includes('config')) {
        const parts = cmd.split(' ');
        if (parts[1]) state.hostname = parts[1];
        updatePrompt();
        appendOutput(cmd, '');
        return;
      }
    }
    if (lower.startsWith('interface ') || lower.startsWith('int ')) {
      if (state.mode === 'global') {
        state.mode = 'config-if';
        updatePrompt();
        appendOutput(cmd, '');
        return;
      }
    }
    if (lower === 'exit') {
      if (state.mode === 'config-if' || state.mode === 'config-vlan') state.mode = 'global';
      else if (state.mode === 'global') state.mode = 'privileged';
      else if (state.mode === 'privileged') state.mode = 'user';
      updatePrompt();
      appendOutput(cmd, '');
      return;
    }

    // Show commands
    if (lower.includes('sh ip int') || lower.includes('show ip interface brief')) {
      appendOutput(cmd,
`Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0/0   192.168.1.1     YES manual up                    up      
GigabitEthernet0/0/1   10.0.0.1        YES manual up                    up      
GigabitEthernet0/0/2   unassigned      YES unset  administratively down down    
Vlan1                  unassigned      YES unset  administratively down down`);
      return;
    }

    if (lower.includes('show ip route') || lower.includes('sh ip ro')) {
      appendOutput(cmd,
`Codes: L - local, C - connected, S - static, R - RIP, O - OSPF, IA - OSPF inter area
Gateway of last resort is 203.0.113.1 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 203.0.113.1
      10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks
C        10.0.0.0/30 is directly connected, GigabitEthernet0/0/1
L        10.0.0.1/32 is directly connected, GigabitEthernet0/0/1
O     172.16.10.0/24 [110/2] via 10.0.0.2, 00:14:22, GigabitEthernet0/0/1
      192.168.1.0/24 is variably subnetted, 2 subnets, 2 masks
C        192.168.1.0/24 is directly connected, GigabitEthernet0/0/0
L        192.168.1.1/32 is directly connected, GigabitEthernet0/0/0`);
      return;
    }

    if (lower.includes('show vlan') || lower.includes('sh vlan')) {
      appendOutput(cmd,
`VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Fa0/11, Fa0/12, Gi0/2
10   IT_Dept                          active    Fa0/1, Fa0/2, Fa0/3, Fa0/4, Fa0/5
20   HR_Dept                          active    Fa0/6, Fa0/7, Fa0/8, Fa0/9, Fa0/10
30   Guest_WiFi                       active    Fa0/13, Fa0/14
99   Management                       active    
1002 fddi-default                     act/unsup 
1003 token-ring-default               act/unsup 
1004 fddinet-default                  act/unsup 
1005 trnet-default                    act/unsup `);
      return;
    }

    if (lower.includes('show interfaces trunk') || lower.includes('sh int trunk')) {
      appendOutput(cmd,
`Port        Mode             Encapsulation  Status        Native vlan
Gi0/1       on               802.1q         trunking      99

Port        Vlans allowed on trunk
Gi0/1       1-4094

Port        Vlans allowed and active in management domain
Gi0/1       1,10,20,30,99

Port        Vlans in spanning tree forwarding state and not pruned
Gi0/1       1,10,20,30,99`);
      return;
    }

    if (lower.includes('show etherchannel') || lower.includes('sh etherchannel')) {
      appendOutput(cmd,
`Flags:  D - down        P - bundled in port-channel
        I - stand-alone s - suspended
        H - Hot-standby (LACP only)
        R - Layer3      S - Layer2
Group  Port-channel  Protocol    Ports
------+-------------+-----------+-----------------------------------------------
1      Po1(SU)         LACP      Gi0/1(P)    Gi0/2(P)   `);
      return;
    }

    if (lower.includes('show ip ospf neighbor') || lower.includes('sh ip ospf nei')) {
      appendOutput(cmd,
`Neighbor ID     Pri   State           Dead Time   Address         Interface
2.2.2.2           1   FULL/BDR        00:00:34    10.0.0.2        GigabitEthernet0/0/1`);
      return;
    }

    if (lower.includes('show standby') || lower.includes('sh standby')) {
      appendOutput(cmd,
`                     P indicates configured to preempt.
                     |
Interface   Grp  Pri P State   Active          Standby         Virtual IP
Gi0/0/0     1    110 P Active  local           192.168.1.3     192.168.1.1`);
      return;
    }

    if (lower.includes('show access-lists') || lower.includes('sh access-l')) {
      appendOutput(cmd,
`Standard IP access list 10
    10 permit 192.168.1.0, wildcard bits 0.0.0.255 (450 matches)
    20 deny   any (12 matches)
Extended IP access list 101
    10 deny tcp host 192.168.1.50 host 10.0.0.50 eq www (2 matches)
    20 deny tcp host 192.168.1.50 host 10.0.0.50 eq 443 (8 matches)
    30 permit ip any any (14302 matches)`);
      return;
    }

    // TDR Cable Diagnostics
    if (lower.includes('test cable-diagnostics tdr')) {
      appendOutput(cmd,
`TDR test started on interface GigabitEthernet0/1
A TDR test can take a few seconds to run on an interface.
Use 'show cable-diagnostics tdr interface GigabitEthernet0/1' to read the TDR results.`);
      return;
    }

    if (lower.includes('show cable-diagnostics tdr')) {
      appendOutput(cmd,
`TDR test last run on: October 09 03:30:15

Interface Speed Local pair Pair length        Remote pair Pair status
--------- ----- ---------- ------------------ ----------- --------------------
Gi0/1     1000M Pair A     8    +/- 10 meters Pair B      Normal             
                Pair B     8    +/- 10 meters Pair A      Normal             
                Pair C     8    +/- 10 meters Pair D      Normal             
                Pair D     8    +/- 10 meters Pair C      Normal             `);
      return;
    }

    // Default simulation response
    appendOutput(cmd, `% Command executed successfully.`);
  }

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = inputEl.value;
      inputEl.value = '';
      handleCommand(val);
    } else if (e.key === 'ArrowUp') {
      if (state.historyIdx > 0) {
        state.historyIdx--;
        inputEl.value = state.history[state.historyIdx] || '';
      }
    } else if (e.key === 'ArrowDown') {
      if (state.historyIdx < state.history.length - 1) {
        state.historyIdx++;
        inputEl.value = state.history[state.historyIdx] || '';
      } else {
        state.historyIdx = state.history.length;
        inputEl.value = '';
      }
    }
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd') || chip.textContent.trim();
      handleCommand(cmd);
    });
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ==========================================================================
   7. Packet Encapsulation Flow Visualizer
   ========================================================================== */
function initEncapsulationVisualizer() {
  const steps = document.querySelectorAll('.pdu-step');
  const preview = document.getElementById('encapsulationPreview');

  const pduDetails = {
    'app': {
      title: 'Layer 7-5: Application Data',
      pdu: 'Data',
      desc: 'ข้อมูลดั้งเดิมจากแอปพลิเคชัน (เช่น ข้อความ HTTP Request, DNS Query, อีเมล SMTP)',
      header: '[ Data Payload ]'
    },
    'transport': {
      title: 'Layer 4: Transport Layer',
      pdu: 'Segment (TCP) / Datagram (UDP)',
      desc: 'เพิ่ม Header ที่ระบุ Source Port และ Destination Port (เช่น Port 80, 443) ควบคุม Flow Control และ Sequence Number',
      header: '[ TCP/UDP Header | Data Payload ]'
    },
    'network': {
      title: 'Layer 3: Network Layer',
      pdu: 'Packet',
      desc: 'เพิ่ม IP Header ที่ระบุ Source IP และ Destination IP Address พร้อมค่า TTL (Time to Live) และ Protocol Number',
      header: '[ IP Header | TCP Header | Data Payload ]'
    },
    'datalink': {
      title: 'Layer 2: Data Link Layer',
      pdu: 'Frame',
      desc: 'เพิ่ม Ethernet Header (Source MAC, Destination MAC, 802.1Q VLAN Tag) และปิดท้ายด้วย FCS Trailer (CRC Checksum)',
      header: '[ Ethernet Header | IP Header | TCP Header | Data Payload | FCS Trailer ]'
    },
    'physical': {
      title: 'Layer 1: Physical Layer',
      pdu: 'Bits',
      desc: 'แปลงข้อมูลเฟรมทั้งหมดให้เป็นสัญญาณไฟฟ้า (Copper UTP), สัญญาณแสง (Fiber Optic), หรือคลื่นวิทยุ (Wireless RF)',
      header: '01010110 01101100 01100001 01101110 00100000 01010010 01101111 01110101 01110100 01100101'
    }
  };

  steps.forEach(step => {
    step.addEventListener('click', () => {
      steps.forEach(s => s.classList.remove('active'));
      step.classList.add('active');

      const layer = step.getAttribute('data-layer');
      const data = pduDetails[layer];
      if (data && preview) {
        preview.innerHTML = `
          <div style="background: var(--bg-tertiary); padding: 18px; border-radius: var(--radius-md); border-left: 4px solid var(--accent-cyan);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <h4 style="color: var(--accent-cyan); font-size: 1.1rem;">${data.title}</h4>
              <span class="badge-tag">PDU: ${data.pdu}</span>
            </div>
            <p style="color: var(--text-secondary); margin-bottom: 12px;">${data.desc}</p>
            <div style="background: var(--code-bg); padding: 12px; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 0.85rem; color: #67e8f9; overflow-x: auto;">
              ${data.header}
            </div>
          </div>
        `;
      }
    });
  });
}

/* ==========================================================================
   8. Interactive Quiz System
   ========================================================================== */
const quizQuestions = [
  {
    question: "1. ค่า Administrative Distance (AD) ของ OSPF มีค่าเริ่มต้นเท่ากับเท่าใด?",
    options: ["90", "110", "120", "1"],
    answer: 1,
    explanation: "OSPF มีค่าเริ่มต้น AD = 110 (ขณะที่ Connected = 0, Static = 1, EIGRP = 90, RIP = 120)"
  },
  {
    question: "2. ในการตั้งค่า Router-on-a-Stick (ROAS) จำเป็นต้องใส่คำสั่งใดบน Sub-interface เป็นอันดับแรกก่อนกำหนด IP Address?",
    options: ["no shutdown", "encapsulation dot1q <vlan-id>", "switchport mode trunk", "ip routing"],
    answer: 1,
    explanation: "ต้องกำหนด 'encapsulation dot1q <vlan-id>' ก่อน เพื่อให้ Router ทราบว่า Sub-interface นั้นผูกกับ VLAN Tag ใด มิฉะนั้น IOS จะไม่อนุญาตให้ใส่คำสั่ง ip address"
  },
  {
    question: "3. Virtual MAC Address ของ HSRP Group 1 คือข้อใด?",
    options: ["0000.0c07.ac01", "0000.5e00.0101", "ffff.ffff.ffff", "0100.5e00.0001"],
    answer: 0,
    explanation: "HSRP Version 1 ใช้ Virtual MAC Address ในรูปแบบ 0000.0c07.acXX โดย XX คือเลข Group ในรูปแบบเลขฐานสิบหก (Group 1 = 01)"
  },
  {
    question: "4. Wildcard Mask สำหรับ Subnet Mask 255.255.255.240 (/28) คือข้อใด?",
    options: ["0.0.0.15", "0.0.0.31", "0.0.0.240", "255.255.255.15"],
    answer: 0,
    explanation: "วิธีคิด Wildcard Mask นำ 255.255.255.255 ลบด้วย 255.255.255.240 จะได้ 0.0.0.15"
  },
  {
    question: "5. บรรทัดสุดท้ายของ Access Control List (ACL) ใน Cisco IOS มีกฎแฝงใดทำงานอยู่เสมอ?",
    options: ["permit ip any any", "implicit deny any", "log all", "permit established"],
    answer: 1,
    explanation: "Cisco ACL มีกฎแฝงสุดท้ายคือ 'Implicit Deny Any' ซึ่งจะปฏิเสธทุกแพ็กเก็ตที่ไม่ตรงกับเงื่อนไขด้านบนโดยอัตโนมัติ"
  }
];

function initQuiz() {
  const container = document.getElementById('quizContainer');
  if (!container) return;

  renderQuiz(container);
}

function renderQuiz(container) {
  container.innerHTML = '';
  let score = 0;
  let answeredCount = 0;

  quizQuestions.forEach((q, idx) => {
    const box = document.createElement('div');
    box.className = 'quiz-box';
    box.innerHTML = `
      <div class="quiz-question">${q.question}</div>
      <div class="quiz-options" id="quiz-options-${idx}">
        ${q.options.map((opt, optIdx) => `
          <div class="quiz-option" data-q="${idx}" data-opt="${optIdx}">
            <span>${opt}</span>
          </div>
        `).join('')}
      </div>
      <div class="quiz-feedback" id="quiz-feedback-${idx}"></div>
    `;
    container.appendChild(box);

    const optionEls = box.querySelectorAll('.quiz-option');
    optionEls.forEach(el => {
      el.addEventListener('click', () => {
        if (box.dataset.answered === 'true') return;
        box.dataset.answered = 'true';
        answeredCount++;

        const selectedOpt = parseInt(el.getAttribute('data-opt'), 10);
        const feedbackEl = document.getElementById(`quiz-feedback-${idx}`);

        optionEls.forEach((optEl, i) => {
          optEl.style.pointerEvents = 'none';
          if (i === q.answer) optEl.classList.add('correct');
        });

        if (selectedOpt === q.answer) {
          el.classList.add('correct');
          score++;
          feedbackEl.className = 'quiz-feedback info-pill success';
          feedbackEl.style.display = 'block';
          feedbackEl.innerHTML = `<strong>ถูกต้อง! 🎉</strong> ${q.explanation}`;
        } else {
          el.classList.add('incorrect');
          feedbackEl.className = 'quiz-feedback info-pill danger';
          feedbackEl.style.display = 'block';
          feedbackEl.innerHTML = `<strong>ยังไม่ถูกต้อง ❌</strong> ${q.explanation}`;
        }

        if (answeredCount === quizQuestions.length) {
          showFinalScore(container, score, quizQuestions.length);
        }
      });
    });
  });
}

function showFinalScore(container, score, total) {
  const div = document.createElement('div');
  div.className = 'content-card';
  div.style.textAlign = 'center';
  div.style.marginTop = '24px';
  div.style.borderColor = 'var(--accent-cyan)';
  div.innerHTML = `
    <h3 style="font-size: 1.4rem; color: var(--accent-cyan); margin-bottom: 8px;">ผลการทดสอบของคุณ</h3>
    <p style="font-size: 1.8rem; font-weight: 800; color: #34d399; margin-bottom: 12px;">${score} / ${total} คะแนน</p>
    <p style="color: var(--text-secondary); margin-bottom: 18px;">${score >= 4 ? 'ยอดเยี่ยมมาก! คุณมีความเข้าใจพื้นฐาน Network เป็นอย่างดี พร้อมสำหรับการลงมือปฏิบัติจริง' : 'ทบทวนเนื้อหาในแต่ละโมดูลเพิ่มเติม แล้วลองทำแบบทดสอบใหม่อีกครั้งนะครับ'}</p>
    <button class="btn-icon" id="btnRetryQuiz" style="margin: 0 auto; background: var(--accent-blue); color: white;">ทำแบบทดสอบอีกครั้ง</button>
  `;
  container.appendChild(div);

  document.getElementById('btnRetryQuiz').addEventListener('click', () => {
    renderQuiz(container);
  });
}

/* ==========================================================================
   9. Copy Code Blocks
   ========================================================================== */
function initCodeCopy() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      let text = '';
      if (targetId) {
        const el = document.getElementById(targetId);
        text = el ? el.textContent : '';
      } else {
        const pre = btn.closest('.code-block-container').querySelector('pre');
        text = pre ? pre.textContent : '';
      }

      if (text) {
        navigator.clipboard.writeText(text).then(() => {
          const original = btn.textContent;
          btn.textContent = 'คัดลอกแล้ว! ✓';
          btn.style.color = '#34d399';
          setTimeout(() => {
            btn.textContent = original;
            btn.style.color = '';
          }, 2000);
        });
      }
    });
  });
}
