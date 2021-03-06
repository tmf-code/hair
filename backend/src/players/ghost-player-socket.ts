import { BufferedPlayerData } from './../../../@types/messages.d';
import { IPlayerData } from './i-player-data';

export class GhostPlayerSocket {
  private readonly id: string;
  private currentGhostIndex: number;

  constructor(id: string, ghostIndex: number, maxGhosts: number) {
    this.id = id;
    const startOffset = Math.floor((ghostData.length / maxGhosts) * ghostIndex);
    this.currentGhostIndex = startOffset;
  }

  clearPlayerData(): void {
    // NOOP
  }

  getPlayerData(): IPlayerData {
    this.currentGhostIndex++;
    this.currentGhostIndex %= ghostData.length;

    const playerLocations = ghostData[this.currentGhostIndex];
    return {
      id: this.id,
      bufferedPlayerData: playerLocations,
    };
  }
}

const ghostData: BufferedPlayerData[] = [
  [
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
  ],
  [
    {
      rotation: -0.4973427163468225,
      position: [-0.4184100424286924, 0.7558593737194315],
      state: 'CUTTING',
    },
    {
      rotation: -1.3258176636680326,
      position: [-0.3755230373086662, 0.8261718747438863],
      state: 'CUTTING',
    },
    {
      rotation: -1.5216555923788764,
      position: [-0.3263598302852305, 0.8427734363474882],
      state: 'CUTTING',
    },
    {
      rotation: -1.5707963267948966,
      position: [-0.20292888953967525, 0.8496093696216119],
      state: 'CUTTING',
    },
    {
      rotation: -1.5707963267948966,
      position: [-0.0020920438915570383, 0.8496093696216119],
      state: 'CUTTING',
    },
    {
      rotation: -1.5152978215491797,
      position: [0.15376568251623945, 0.8496093696216119],
      state: 'CUTTING',
    },
    {
      rotation: -1.5527802582408412,
      position: [0.448744713970638, 0.8564453192870135],
      state: 'CUTTING',
    },
    {
      rotation: -1.5707963267948966,
      position: [0.721757249449319, 0.8593749979510903],
      state: 'CUTTING',
    },
    {
      rotation: -1.5707963267948966,
      position: [0.7949791367975063, 0.8593749979510903],
      state: 'CUTTING',
    },
    { rotation: 0, position: [0.823221764447895, 0.8613281170604747], state: 'CUTTING' },
  ],
  [
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    {
      rotation: -0.2059913366758315,
      position: [-0.4205020863202493, -0.1787109558121307],
      state: 'CUTTING',
    },
    {
      rotation: -0.29611514587496474,
      position: [-0.3995815771759409, -0.06250000819563906],
      state: 'CUTTING',
    },
    {
      rotation: -0.19424099618140392,
      position: [-0.3577405588873239, 0.0761719075264421],
      state: 'CUTTING',
    },
    { rotation: 0, position: [-0.32845187417678745, 0.23046877612359917], state: 'CUTTING' },
    { rotation: 0, position: [-0.32845187417678745, 0.30859373719431415], state: 'CUTTING' },
    {
      rotation: 0.05314140884493546,
      position: [-0.32845187417678745, 0.3564453192870135],
      state: 'CUTTING',
    },
    {
      rotation: 0.36339313349523067,
      position: [-0.34728033942953895, 0.5234374948777256],
      state: 'CUTTING',
    },
    { rotation: 0, position: [-0.4058577088506119, 0.6816406344762076], state: 'CUTTING' },
  ],
  [
    {
      rotation: 0.2984989315861793,
      position: [0.4686193065122759, 0.3417968931840739],
      state: 'CUTTING',
    },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    {
      rotation: 0.13255153229667402,
      position: [0.1119246642276226, -0.3681640995084321],
      state: 'CUTTING',
    },
    { rotation: 0, position: [0.10774057644450852, -0.3369140626280569], state: 'CUTTING' },
    {
      rotation: -0.21634066137329055,
      position: [0.09937240087828059, -0.20312504302710455],
      state: 'CUTTING',
    },
    {
      rotation: -0.3680494903369657,
      position: [0.14330546305845449, -0.012695306993555144],
      state: 'CUTTING',
    },
    {
      rotation: -0.20232162837830373,
      position: [0.263598302852305, 0.29394531109137456],
      state: 'CUTTING',
    },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
  ],
  [
    {
      rotation: -0.16743177847052315,
      position: [0.6841004594012929, -0.3291015861905189],
      state: 'CUTTING',
    },
    {
      rotation: -0.21047240812402934,
      position: [0.734309653256138, -0.03320315598975987],
      state: 'CUTTING',
    },
    { rotation: 0, position: [0.8305439531827137, 0.3828125256113717], state: 'CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [0.45920500365716155, -0.5351562095340328], state: 'CUTTING' },
    {
      rotation: 0.04834938665190287,
      position: [0.45502091587404747, -0.45605465612606966],
      state: 'CUTTING',
    },
    {
      rotation: -0.07448879021388172,
      position: [0.448744713970638, -0.3300781129626553],
      state: 'CUTTING',
    },
    { rotation: 0, position: [0.4560669027054569, -0.1474609189317555], state: 'CUTTING' },
    {
      rotation: -0.04265703474856042,
      position: [0.4560669027054569, -0.020507783431093163],
      state: 'CUTTING',
    },
  ],
  [
    {
      rotation: -2.356194490192345,
      position: [0.6025103964868777, 0.6201171858352608],
      state: 'CUTTING',
    },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [0.6579498054137227, -0.7568359168828458], state: 'CUTTING' },
    {
      rotation: -0.08550529367820464,
      position: [0.6579498054137227, -0.732421829667872],
      state: 'CUTTING',
    },
    {
      rotation: -0.11487660541689913,
      position: [0.6610879063654276, -0.6289061890449352],
      state: 'CUTTING',
    },
    {
      rotation: -0.0705895898188736,
      position: [0.6694560819316555, -0.5146484916680512],
      state: 'CUTTING',
    },
  ],
  [
    {
      rotation: -0.13255153229667402,
      position: [0.5815899575713077, 0.3408203008468259],
      state: 'CUTTING',
    },
    { rotation: 0, position: [0.5836820716916031, 0.37011721861781666], state: 'CUTTING' },
    { rotation: 0, position: [0.5836820716916031, 0.3984374784864477], state: 'CUTTING' },
    { rotation: 0, position: [0.5836820716916031, 0.4238280924735579], state: 'CUTTING' },
    {
      rotation: -0.09966865249116202,
      position: [0.5868200321858308, 0.4462890605791471],
      state: 'CUTTING',
    },
    { rotation: 0, position: [0.5920502472578311, 0.47851562423165883], state: 'CUTTING' },
    { rotation: 0, position: [0.5972803218723544, 0.508789068774786], state: 'CUTTING' },
    {
      rotation: -0.12435499454676144,
      position: [0.5972803218723544, 0.5244140544324178],
      state: 'CUTTING',
    },
    { rotation: 0, position: [0.5993724359926498, 0.5449218706460668], state: 'CUTTING' },
    {
      rotation: -0.09966865249116202,
      position: [0.5993724359926498, 0.5800781129626553],
      state: 'CUTTING',
    },
  ],
  [
    { rotation: 0, position: [0.5596233913668514, 0.01367189933080315], state: 'CUTTING' },
    { rotation: 0, position: [0.5596233913668514, 0.08398438396398011], state: 'CUTTING' },
    {
      rotation: -0.3430239404207034,
      position: [0.5596233913668514, 0.10449216739507317],
      state: 'CUTTING',
    },
    { rotation: 0, position: [0.5648536064388516, 0.13085937371943146], state: 'CUTTING' },
    {
      rotation: -0.07130746478529032,
      position: [0.5648536064388516, 0.1513671571505245],
      state: 'CUTTING',
    },
    {
      rotation: -0.27094685033842053,
      position: [0.5669455801016701, 0.17968748258426726],
      state: 'CUTTING',
    },
    {
      rotation: -0.04995839572194276,
      position: [0.5742677688364888, 0.21582028445554802],
      state: 'CUTTING',
    },
    { rotation: 0, position: [0.5784518566196029, 0.2529296786640768], state: 'CUTTING' },
    { rotation: 0, position: [0.5784518566196029, 0.26660157799487993], state: 'CUTTING' },
    {
      rotation: -0.22679884805388587,
      position: [0.5784518566196029, 0.3144530945224676],
      state: 'CUTTING',
    },
  ],
  [
    {
      rotation: -0.22679884805388587,
      position: [0.5449790138972139, -0.5195312566589567],
      state: 'CUTTING',
    },
    {
      rotation: -0.052583061610941714,
      position: [0.5481171148489186, -0.47070308222900925],
      state: 'CUTTING',
    },
    {
      rotation: -0.08865588186743747,
      position: [0.5533473299209188, -0.4033203746075764],
      state: 'CUTTING',
    },
    {
      rotation: -0.27094685033842053,
      position: [0.5585774045354421, -0.33496087795356067],
      state: 'CUTTING',
    },
    { rotation: 0, position: [0.5679915669330793, -0.2617187474388629], state: 'CUTTING' },
    { rotation: 0, position: [0.5679915669330793, -0.18749995902180516], state: 'CUTTING' },
    {
      rotation: 0.23860932250820094,
      position: [0.5648536064388516, -0.13867191572208104],
      state: 'CUTTING',
    },
    { rotation: 0, position: [0.5554393035837375, -0.08105467251734755], state: 'CUTTING' },
    { rotation: 0, position: [0.5554393035837375, -0.046874989755451235], state: 'CUTTING' },
    {
      rotation: -0.32175055439664224,
      position: [0.5554393035837375, -0.014648426102939593],
      state: 'CUTTING',
    },
  ],
  [
    {
      rotation: 0.21866894587394198,
      position: [0.35460252816435767, 0.6289062546100469],
      state: 'CUTTING',
    },
    { rotation: 0, position: [0.34832632626094817, 0.6640624969266353], state: 'CUTTING' },
    { rotation: 0, position: [0.34832632626094817, 0.712890638574027], state: 'CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    {
      rotation: -0.05400150037596829,
      position: [0.5418410534029863, -0.5898438068572451],
      state: 'CUTTING',
    },
  ],
  [
    {
      rotation: 0.13552771398550073,
      position: [0.35355654133294845, 0.018554664321708603],
      state: 'CUTTING',
    },
    {
      rotation: 0.15264932839526518,
      position: [0.34623435259812974, 0.07031248463317696],
      state: 'CUTTING',
    },
    { rotation: 0, position: [0.3326359619599015, 0.14160156160360204], state: 'CUTTING' },
    { rotation: 0, position: [0.3326359619599015, 0.17089841380948112], state: 'CUTTING' },
    {
      rotation: -0.1297025371559121,
      position: [0.3326359619599015, 0.20703128124587344],
      state: 'CUTTING',
    },
    {
      rotation: 0.07677189126977803,
      position: [0.35355654133294845, 0.3437500122934585],
      state: 'CUTTING',
    },
    { rotation: 0, position: [0.3619247168991764, 0.462890638574027], state: 'CUTTING' },
    { rotation: 0, position: [0.3619247168991764, 0.496093761781231], state: 'CUTTING' },
    { rotation: 0, position: [0.3619247168991764, 0.5351562423165885], state: 'CUTTING' },
    {
      rotation: 0.2110933332227465,
      position: [0.35983260277888096, 0.5878906221827491],
      state: 'CUTTING',
    },
  ],
  [
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    {
      rotation: -0.21866894587394195,
      position: [0.338912163863311, -0.6591796991531742],
      state: 'CUTTING',
    },
    {
      rotation: -0.10168885176307704,
      position: [0.34832632626094817, -0.6171874743886283],
      state: 'CUTTING',
    },
    { rotation: 0, position: [0.35878661594747174, -0.5126953069935551], state: 'CUTTING' },
    {
      rotation: -0.03446910099950802,
      position: [0.35878661594747174, -0.47070308222900925],
      state: 'CUTTING',
    },
    {
      rotation: -0.039978687123290044,
      position: [0.3629707037305856, -0.38183599883923525],
      state: 'CUTTING',
    },
    { rotation: 0, position: [0.3744769802485184, -0.3017577875289126], state: 'CUTTING' },
    {
      rotation: 0.09751580328754603,
      position: [0.3744769802485184, -0.2207031805766766],
      state: 'CUTTING',
    },
    {
      rotation: 0.08550529367820464,
      position: [0.3629707037305856, -0.08886721451999713],
      state: 'CUTTING',
    },
  ],
  [
    {
      rotation: -0.13552771398550073,
      position: [0.07008364593900573, 0.09960940240416771],
      state: 'CUTTING',
    },
    {
      rotation: -0.05992815512120788,
      position: [0.07322174689071037, 0.14648439215961906],
      state: 'CUTTING',
    },
    { rotation: 0, position: [0.08054393562552908, 0.2421874907799062], state: 'CUTTING' },
    { rotation: 0, position: [0.08054393562552908, 0.2724609353230334], state: 'CUTTING' },
    { rotation: 0, position: [0.08054393562552908, 0.30078126075677614], state: 'CUTTING' },
    { rotation: 0, position: [0.08054393562552908, 0.4003905975958323], state: 'CUTTING' },
    {
      rotation: -0.31705575320914703,
      position: [0.08995816825190484, 0.5107421878841706],
      state: 'CUTTING',
    },
    {
      rotation: -0.33155416187593817,
      position: [0.14016736210674985, 0.6582031395984819],
      state: 'CUTTING',
    },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
  ],
  [
    { rotation: 0, position: [0.05543933869810669, -0.34765625051222737], state: 'CUTTING' },
    {
      rotation: -0.162727374640381,
      position: [0.05753138258966373, -0.31542968685971573],
      state: 'CUTTING',
    },
    { rotation: 0, position: [0.07426780395085819, -0.20507809657137743], state: 'CUTTING' },
    { rotation: 0, position: [0.0815899224569383, -0.17187500614672913], state: 'CUTTING' },
    {
      rotation: 0.1470783553884025,
      position: [0.07949787856538149, -0.15332034182502063],
      state: 'CUTTING',
    },
    { rotation: 0, position: [0.07531379078226741, -0.10937506351620185], state: 'CUTTING' },
    { rotation: 0, position: [0.0679916020474487, -0.046874989755451235], state: 'CUTTING' },
    { rotation: 0, position: [0.07008364593900573, -0.010742187884170473], state: 'CUTTING' },
    { rotation: 0, position: [0.07008364593900573, 0.0458984629833149], state: 'CUTTING' },
    {
      rotation: -0.13552771398550073,
      position: [0.07008364593900573, 0.09960940240416771],
      state: 'CUTTING',
    },
  ],
  [
    {
      rotation: 3.091275449128315,
      position: [-0.15794977029935353, 0.7177734363474882],
      state: 'CUTTING',
    },
    {
      rotation: 2.6527402992620455,
      position: [-0.17887027944366196, 0.4121093778172509],
      state: 'CUTTING',
    },
    {
      rotation: 2.643770320972792,
      position: [-0.2374477190934734, 0.291015599644742],
      state: 'CUTTING',
    },
    {
      rotation: 3.0406708689224993,
      position: [-0.338912163863311, 0.0800781457452111],
      state: 'CUTTING',
    },
    {
      rotation: 2.963182154238753,
      position: [-0.3619247168991765, -0.07226560374256152],
      state: 'CUTTING',
    },
    {
      rotation: -2.9205455909147746,
      position: [-0.37761508120022313, -0.16699224115582378],
      state: 'CUTTING',
    },
    {
      rotation: -2.7367008673047097,
      position: [-0.3378661068031632, -0.35839843839639807],
      state: 'CUTTING',
    },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
  ],
  [
    {
      rotation: -0.05549850524571684,
      position: [-0.5156903643010466, 0.425781277148054],
      state: 'CUTTING',
    },
    {
      rotation: 0.5358112379604637,
      position: [-0.5010460219457785, 0.5917968604015181],
      state: 'CUTTING',
    },
    {
      rotation: 0.2110933332227465,
      position: [-0.5502091938548449, 0.6689453274826525],
      state: 'CUTTING',
    },
    {
      rotation: -0.12435499454676144,
      position: [-0.5805439356255291, 0.7734374948777256],
      state: 'CUTTING',
    },
    {
      rotation: -0.6146629519221655,
      position: [-0.5679916371618179, 0.8535156242316588],
      state: 'CUTTING',
    },
    {
      rotation: -1.1606689862534056,
      position: [-0.49686193416266455, 0.9453125010244549],
      state: 'CUTTING',
    },
    { rotation: -1.4306946023982663, position: [-0.4205020863202493, 0.96875], state: 'CUTTING' },
    {
      rotation: -2.417342652841646,
      position: [-0.2615062589607481, 0.9873046878841706],
      state: 'CUTTING',
    },
    {
      rotation: -2.7686049317897323,
      position: [-0.18619246817848067, 0.8994140626280569],
      state: 'CUTTING',
    },
    {
      rotation: 3.141592653589793,
      position: [-0.17050210387743403, 0.8652343716705216],
      state: 'CUTTING',
    },
  ],
  [
    {
      rotation: 2.1266671359490545,
      position: [0.025104596927422396, -0.5039063037838807],
      state: 'CUTTING',
    },
    {
      rotation: 1.5707963267948966,
      position: [-0.16527195903417224, -0.576171907526442],
      state: 'CUTTING',
    },
    {
      rotation: 1.2120256565243244,
      position: [-0.343096251646425, -0.566406246414408],
      state: 'CUTTING',
    },
    {
      rotation: 0.450073782082437,
      position: [-0.43305438478396063, -0.5214843102032296],
      state: 'CUTTING',
    },
    {
      rotation: 0.18394345653717517,
      position: [-0.5104602545721542, -0.36914062628056854],
      state: 'CUTTING',
    },
    { rotation: 0, position: [-0.5324267856622412, -0.2158202844555479], state: 'CUTTING' },
    {
      rotation: 0.06512516333438588,
      position: [-0.5324267856622412, 0.004882830556017015],
      state: 'CUTTING',
    },
    {
      rotation: 0.1599131231582193,
      position: [-0.5418410182886169, 0.13183596605667947],
      state: 'CUTTING',
    },
    { rotation: 0, position: [-0.5512552158006234, 0.1894531436963014], state: 'CUTTING' },
    {
      rotation: -0.1899882879187157,
      position: [-0.5512552158006234, 0.2285156570142146],
      state: 'CUTTING',
    },
  ],
  [
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    {
      rotation: 2.0344439357957027,
      position: [0.07322174689071037, 1.0097656252561138],
      state: 'CUTTING',
    },
    {
      rotation: 2.639502454567799,
      position: [-0.0020920438915570383, 0.9306640585302374],
      state: 'CUTTING',
    },
    {
      rotation: 2.770701364777131,
      position: [-0.06589955815589166, 0.8046874989755451],
      state: 'CUTTING',
    },
    {
      rotation: -2.9562447035940984,
      position: [-0.07949787856538137, 0.7578124928288159],
      state: 'CUTTING',
    },
    {
      rotation: -2.7580651376328014,
      position: [-0.03242678566224122, 0.6103515575057825],
      state: 'CUTTING',
    },
    {
      rotation: -2.761086276477428,
      position: [0.08054393562552908, 0.36230467661516697],
      state: 'CUTTING',
    },
    {
      rotation: -3.109518095812492,
      position: [0.18305436722677593, 0.11816406672587632],
      state: 'CUTTING',
    },
    {
      rotation: 2.643770320972792,
      position: [0.18723845500989, -0.2392578448983853],
      state: 'CUTTING',
    },
  ],
  [
    { rotation: 0, position: [0.9309623408924037, 0.9208984383963981], state: 'CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
  ],
  [
    {
      rotation: -1.2392421649189584,
      position: [0.6286610504744479, 0.7363281170604747],
      state: 'CUTTING',
    },
    {
      rotation: 1.3258176636680326,
      position: [0.9665271572776111, 0.829101569799241],
      state: 'CUTTING',
    },
    {
      rotation: 1.5707963267948966,
      position: [0.671548055594474, 0.8906250020489097],
      state: 'CUTTING',
    },
    {
      rotation: -1.486784014987402,
      position: [0.5648536064388516, 0.8964843757683412],
      state: 'CUTTING',
    },
    {
      rotation: -1.4181469983996315,
      position: [0.8315899400141229, 0.9130859373719431],
      state: 'CUTTING',
    },
    {
      rotation: 1.5707963267948966,
      position: [1.0031381009517046, 0.9316406262805685],
      state: 'CUTTING',
    },
    {
      rotation: 1.3258176636680326,
      position: [0.7479079034368892, 0.9316406262805685],
      state: 'CUTTING',
    },
    {
      rotation: -1.2490457723982544,
      position: [0.6956067359192257, 0.935546876792796],
      state: 'CUTTING',
    },
    {
      rotation: -1.5957911204138169,
      position: [0.7081589992685677, 0.939453123207204],
      state: 'CUTTING',
    },
    {
      rotation: -1.2490457723982544,
      position: [0.9006275991217194, 0.9199218788417057],
      state: 'CUTTING',
    },
  ],
  [
    {
      rotation: 3.050932766389048,
      position: [0.8158995757130763, 0.6738281252561138],
      state: 'CUTTING',
    },
    {
      rotation: -1.4644034720959924,
      position: [0.8263598653995998, 0.6562499877065415],
      state: 'CUTTING',
    },
    {
      rotation: 1.669995716063817,
      position: [0.9518827798079736, 0.6718750061467292],
      state: 'CUTTING',
    },
    {
      rotation: -1.54688783984769,
      position: [0.27824268032194266, 0.6132812361698592],
      state: 'CUTTING',
    },
    {
      rotation: 1.6074465746053084,
      position: [1.0031381009517046, 0.6328124928288159],
      state: 'CUTTING',
    },
    {
      rotation: -1.4957287372409858,
      position: [0.44769872713922876, 0.6181640667258763],
      state: 'CUTTING',
    },
    {
      rotation: 1.5198201197195833,
      position: [1.0031381009517046, 0.7031250102445488],
      state: 'CUTTING',
    },
    {
      rotation: -1.4889284388702053,
      position: [0.5596233913668514, 0.6953125010244549],
      state: 'CUTTING',
    },
    {
      rotation: 1.5707963267948966,
      position: [0.9539748939282691, 0.7343749979510903],
      state: 'CUTTING',
    },
    {
      rotation: 1.5596856728972892,
      position: [0.7594141799548217, 0.7382812525611372],
      state: 'CUTTING',
    },
  ],
  [
    {
      rotation: -2.953952881785427,
      position: [0.5481171148489186, 0.3271484670811343],
      state: 'CUTTING',
    },
    {
      rotation: -2.000336433044763,
      position: [0.6140166730048102, 0.12109377817250888],
      state: 'CUTTING',
    },
    {
      rotation: -0.7283173809911838,
      position: [0.9257322662778804, 0.012695306993555033],
      state: 'CUTTING',
    },
    { rotation: 0, position: [0.9989540131685908, 0.09374997951090258], state: 'CUTTING' },
    {
      rotation: 0.3308137503423505,
      position: [1.0031381009517046, 0.24804684810805966],
      state: 'CUTTING',
    },
    {
      rotation: -0.039978687123290044,
      position: [0.9456067183620411, 0.39550783260492683],
      state: 'CUTTING',
    },
    {
      rotation: -0.016805140515042,
      position: [0.9476986920248596, 0.5654296868597157],
      state: 'CUTTING',
    },
    {
      rotation: 3.141592653589793,
      position: [0.9435146042417455, 0.7812500040978194],
      state: 'CUTTING',
    },
    {
      rotation: 2.1442368529497253,
      position: [0.9435146042417455, 0.7792968685971571],
      state: 'CUTTING',
    },
    {
      rotation: 2.4301335278502854,
      position: [0.8682008836882167, 0.7333984383963981],
      state: 'CUTTING',
    },
  ],
  [
    {
      rotation: -2.7557099841917196,
      position: [0.5910041199689449, 0.17285153291886568],
      state: 'CUTTING',
    },
    {
      rotation: -0.6254850402392291,
      position: [0.6286610504744479, 0.08203126485459555],
      state: 'CUTTING',
    },
    {
      rotation: -0.5619215622568153,
      position: [0.663179880028246, 0.13476561193820047],
      state: 'CUTTING',
    },
    {
      rotation: -0.17936994083597105,
      position: [0.8441422033634649, 0.3857421714928927],
      state: 'CUTTING',
    },
    {
      rotation: 1.208252089530389,
      position: [0.8964435113386053, 0.7451171858352608],
      state: 'CUTTING',
    },
    {
      rotation: 2.5672878234150915,
      position: [0.7510460043885938, 0.8203125010244549],
      state: 'CUTTING',
    },
    {
      rotation: 2.6224465393432705,
      position: [0.7060668851482721, 0.7636718829395253],
      state: 'CUTTING',
    },
    {
      rotation: 2.9441970937399127,
      position: [0.6558576912934273, 0.6884765513590533],
      state: 'CUTTING',
    },
    {
      rotation: 2.77324373218083,
      position: [0.6286610504744479, 0.5126953069935551],
      state: 'CUTTING',
    },
    {
      rotation: 2.664247271216121,
      position: [0.5784518566196029, 0.3984374784864477],
      state: 'CUTTING',
    },
  ],
  [
    {
      rotation: 0.16514867741462685,
      position: [0.8682008836882167, 0.3554687269497655],
      state: 'CUTTING',
    },
    { rotation: 0, position: [0.865062782736512, 0.4404297032509936], state: 'CUTTING' },
    {
      rotation: -0.41822432957922906,
      position: [0.8682008836882167, 0.5361328018712808],
      state: 'CUTTING',
    },
    {
      rotation: -0.33131964030425276,
      position: [0.9341004418441083, 0.6679687351454044],
      state: 'CUTTING',
    },
    { rotation: 0, position: [1.0031381009517046, 0.9785156242316588], state: 'CUTTING' },
    { rotation: 0, position: [1.0031381009517046, 0.9785156242316588], state: 'CUTTING' },
    { rotation: 1.856847768512215, position: [0.9612970826630878, 0.998046875], state: 'CUTTING' },
    { rotation: 2.1198214666024935, position: [0.8587865808331026, 0.96875], state: 'CUTTING' },
    {
      rotation: 2.6821644288319906,
      position: [0.6610879063654276, 0.8466796909575351],
      state: 'CUTTING',
    },
    {
      rotation: -3.128881473826367,
      position: [0.5596233913668514, 0.6240234240540299],
      state: 'CUTTING',
    },
  ],
  [
    {
      rotation: 3.017237659043032,
      position: [0.3629707037305856, 0.8242187556345018],
      state: 'CUTTING',
    },
    {
      rotation: 2.958481836327309,
      position: [0.35355654133294845, 0.7685546807129865],
      state: 'CUTTING',
    },
    {
      rotation: 3.0810606338076862,
      position: [0.34832632626094817, 0.6962890605791472],
      state: 'CUTTING',
    },
    {
      rotation: 3.0451188784072065,
      position: [0.3430962516464251, 0.6113281170604747],
      state: 'CUTTING',
    },
    {
      rotation: 2.9000269464944672,
      position: [0.3075314352612175, 0.37402345683658567],
      state: 'CUTTING',
    },
    {
      rotation: 3.141592653589793,
      position: [0.26673640380400987, 0.2236328264581976],
      state: 'CUTTING',
    },
    {
      rotation: -2.855541211872475,
      position: [0.2604602019006004, 0.1923827895778223],
      state: 'CUTTING',
    },
    {
      rotation: -1.6251980405966693,
      position: [0.28347275493646573, 0.16796876792796023],
      state: 'CUTTING',
    },
    {
      rotation: -1.0659349551357702,
      position: [0.734309653256138, 0.1484375112690035],
      state: 'CUTTING',
    },
    { rotation: 0, position: [0.8577405940016931, 0.20312497746199287], state: 'CUTTING' },
  ],
  [
    {
      rotation: -0.12914729012802006,
      position: [0.5209204740299391, 0.5810546725173475],
      state: 'CUTTING',
    },
    {
      rotation: -0.48855349002104526,
      position: [0.5721757951736703, 0.7880859373719431],
      state: 'CUTTING',
    },
    {
      rotation: 1.5707963267948966,
      position: [0.6610879063654276, 0.9716796868597157],
      state: 'CUTTING',
    },
    {
      rotation: 1.6262948320406136,
      position: [0.6589957922451319, 0.9716796868597157],
      state: 'CUTTING',
    },
    {
      rotation: 1.5707963267948966,
      position: [0.3629707037305856, 0.9541015616036019],
      state: 'CUTTING',
    },
    {
      rotation: -1.6814535479687924,
      position: [0.3242677863936736, 0.9492187515366823],
      state: 'CUTTING',
    },
    {
      rotation: 2.356194490192345,
      position: [0.4320083628381821, 0.9326171858352609],
      state: 'CUTTING',
    },
    {
      rotation: 2.485897027348257,
      position: [0.4320083628381821, 0.9326171858352609],
      state: 'CUTTING',
    },
    {
      rotation: 2.3086113869153615,
      position: [0.3995816474046794, 0.8945312484633177],
      state: 'CUTTING',
    },
    {
      rotation: 2.835713782184941,
      position: [0.3744769802485184, 0.8691406262805685],
      state: 'CUTTING',
    },
  ],
  [
    {
      rotation: -1.7175595230383602,
      position: [0.49790792099407377, 0.9267578121158294],
      state: 'CUTTING',
    },
    {
      rotation: 3.141592653589793,
      position: [0.7029289246540444, 0.9023437494877725],
      state: 'CUTTING',
    },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    { rotation: 0, position: [-100, -100], state: 'NOT_CUTTING' },
    {
      rotation: -0.3392926144540447,
      position: [0.5418410534029863, 0.19433590868720685],
      state: 'CUTTING',
    },
    {
      rotation: 0.0475831032769834,
      position: [0.5554393035837375, 0.23144530289573562],
      state: 'CUTTING',
    },
    {
      rotation: 0.29544083714372,
      position: [0.5533473299209188, 0.2968750225380071],
      state: 'CUTTING',
    },
    { rotation: 0, position: [0.5251045618130532, 0.3906250020489097], state: 'CUTTING' },
  ],
  [
    {
      rotation: -1.6207547225168395,
      position: [-0.8671548090708843, 0.9785156242316588],
      state: 'CUTTING',
    },
    {
      rotation: -1.5707963267948966,
      position: [-0.7855648514995767, 0.9755859373719431],
      state: 'CUTTING',
    },
    {
      rotation: -1.5707963267948966,
      position: [-0.6809623584495883, 0.9658203131402843],
      state: 'CUTTING',
    },
    {
      rotation: -1.5707963267948966,
      position: [-0.49686193416266455, 0.9658203131402843],
      state: 'CUTTING',
    },
    {
      rotation: -1.6475682180646747,
      position: [-0.41004186686246435, 0.9658203131402843],
      state: 'CUTTING',
    },
    {
      rotation: -1.6359214901292827,
      position: [-0.24058574981643965, 0.9560546889086254],
      state: 'CUTTING',
    },
    {
      rotation: -1.7280243777714657,
      position: [-0.12133889685399835, 0.9531250020489097],
      state: 'CUTTING',
    },
    { rotation: -1.5707963267948966, position: [0.023012553035865357, 0.9375], state: 'CUTTING' },
    {
      rotation: -1.5707963267948966,
      position: [0.22175728456368815, 0.9365234363474882],
      state: 'CUTTING',
    },
    {
      rotation: -1.5707963267948966,
      position: [0.3817991689833371, 0.9345703131402843],
      state: 'CUTTING',
    },
  ],
  [
    { rotation: 0, position: [-0.9257322136063265, 0.6484375112690035], state: 'CUTTING' },
    { rotation: 0, position: [-0.9278242662764757, 0.6953125010244549], state: 'CUTTING' },
    {
      rotation: 1.1324597669369387,
      position: [-0.9518828456474159, 0.7070312484633177],
      state: 'CUTTING',
    },
    {
      rotation: 0.9347208240911457,
      position: [-1.0020920502011703, 0.9677734383963981],
      state: 'CUTTING',
    },
    {
      rotation: -0.4398425828157362,
      position: [-1.0020920502011703, 0.9677734383963981],
      state: 'CUTTING',
    },
    {
      rotation: -0.3430239404207034,
      position: [-1.0020920502011703, 0.9677734383963981],
      state: 'CUTTING',
    },
    {
      rotation: -1.5707963267948966,
      position: [-1.0020920502011703, 0.9677734383963981],
      state: 'CUTTING',
    },
    {
      rotation: -1.446441332248135,
      position: [-1.0020920502011703, 0.9677734383963981],
      state: 'CUTTING',
    },
    {
      rotation: -1.4327903031373772,
      position: [-1.0020920502011703, 0.9677734383963981],
      state: 'CUTTING',
    },
    {
      rotation: -1.4711276743037347,
      position: [-1.0020920502011703, 0.9677734383963981],
      state: 'CUTTING',
    },
  ],
  [
    {
      rotation: 1.5707963267948966,
      position: [-0.1004183877096898, 0.6992187392432239],
      state: 'CUTTING',
    },
    {
      rotation: 1.5707963267948966,
      position: [-0.1820083803953667, 0.6992187392432239],
      state: 'CUTTING',
    },
    {
      rotation: 1.545160918273219,
      position: [-0.2248953855153929, 0.6992187392432239],
      state: 'CUTTING',
    },
    {
      rotation: 1.6475682180646747,
      position: [-0.5428870402343955, 0.7138671981287192],
      state: 'CUTTING',
    },
    {
      rotation: 2.442400063868124,
      position: [-0.692468634967521, 0.7021484506898564],
      state: 'CUTTING',
    },
    {
      rotation: 2.014742051882894,
      position: [-0.7907949787856539, 0.6103515575057825],
      state: 'CUTTING',
    },
    { rotation: 0, position: [-0.9351464418434061, 0.5400390728726056], state: 'CUTTING' },
    {
      rotation: 0.1418970546041639,
      position: [-0.9372384945135553, 0.5449218706460668],
      state: 'CUTTING',
    },
    { rotation: 0, position: [-0.9466527183613388, 0.5634765677503313], state: 'CUTTING' },
    {
      rotation: -0.36520144978817304,
      position: [-0.9466527183613388, 0.5937500122934585],
      state: 'CUTTING',
    },
  ],
  [
    {
      rotation: 3.141592653589793,
      position: [1.0031381009517046, 0.6337890523835081],
      state: 'CUTTING',
    },
    {
      rotation: 3.141592653589793,
      position: [1.0031381009517046, 0.6337890523835081],
      state: 'CUTTING',
    },
    {
      rotation: 3.141592653589793,
      position: [1.0031381009517046, 0.6337890523835081],
      state: 'CUTTING',
    },
    {
      rotation: 1.4505735401335877,
      position: [1.0031381009517046, 0.6337890523835081],
      state: 'CUTTING',
    },
    {
      rotation: 1.5707963267948966,
      position: [0.6788702443292927, 0.6718750061467292],
      state: 'CUTTING',
    },
    {
      rotation: 1.5707963267948966,
      position: [0.5658995932702608, 0.6787109230295749],
      state: 'CUTTING',
    },
    {
      rotation: 1.5707963267948966,
      position: [0.4424686525247057, 0.6787109230295749],
      state: 'CUTTING',
    },
    {
      rotation: 1.5707963267948966,
      position: [0.35146442721265303, 0.6816406344762076],
      state: 'CUTTING',
    },
    {
      rotation: 1.5165859273202331,
      position: [0.2939330446229893, 0.687499991804361],
      state: 'CUTTING',
    },
    {
      rotation: 1.5707963267948966,
      position: [0.056485325529515906, 0.6992187392432239],
      state: 'CUTTING',
    },
  ],
];
