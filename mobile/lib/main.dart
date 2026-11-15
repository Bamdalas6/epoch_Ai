// Companion app for the Epoch AI redesign concept (unofficial).
// Reads the same Python API as the website.
//
//   flutter run -d chrome --dart-define=API_URL=http://127.0.0.1:8000
//   (Android emulator: use http://10.0.2.2:8000)
import 'dart:convert';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

const apiBase = String.fromEnvironment('API_URL', defaultValue: 'http://127.0.0.1:8000');

const teal900 = Color(0xFF072B33);
const teal700 = Color(0xFF026B70);
const teal600 = Color(0xFF00838A);
const ink = Color(0xFF090C0C);
const bodyColor = Color(0xFF212A2A);
const muted = Color(0xFF536565);
const line = Color(0xFFE3E4E4);

void main() => runApp(const EpochApp());

class EpochApp extends StatelessWidget {
  const EpochApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Epoch AI concept',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: Colors.white,
        colorScheme: ColorScheme.fromSeed(seedColor: teal600, brightness: Brightness.light, surface: Colors.white),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          surfaceTintColor: Colors.white,
          foregroundColor: ink,
          elevation: 0,
        ),
      ),
      home: const HomePage(),
    );
  }
}

Color hexColor(String hex) => Color(int.parse('FF${hex.replaceFirst('#', '')}', radix: 16));

Future<Map<String, dynamic>> fetchContent() async {
  final res = await http.get(Uri.parse('$apiBase/api/content')).timeout(const Duration(seconds: 8));
  if (res.statusCode != 200) {
    throw Exception('API returned ${res.statusCode}');
  }
  return jsonDecode(utf8.decode(res.bodyBytes)) as Map<String, dynamic>;
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late Future<Map<String, dynamic>> _content = fetchContent();

  void _retry() => setState(() => _content = fetchContent());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('EPOCH AI', style: TextStyle(fontWeight: FontWeight.w600, letterSpacing: 1.2, fontSize: 18)),
        bottom: const PreferredSize(preferredSize: Size.fromHeight(1), child: Divider(height: 1, color: line)),
      ),
      body: FutureBuilder<Map<String, dynamic>>(
        future: _content,
        builder: (context, snap) {
          if (snap.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator(color: teal600));
          }
          if (snap.hasError || !snap.hasData) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text('Could not reach the content API.',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: ink)),
                    const SizedBox(height: 8),
                    const Text('Start it with: uvicorn main:app --port 8000',
                        textAlign: TextAlign.center, style: TextStyle(color: muted)),
                    const SizedBox(height: 16),
                    FilledButton(
                      onPressed: _retry,
                      style: FilledButton.styleFrom(backgroundColor: teal900, minimumSize: const Size(120, 48)),
                      child: const Text('Try again'),
                    ),
                  ],
                ),
              ),
            );
          }
          return Feed(content: snap.data!);
        },
      ),
    );
  }
}

/// The scrolling home feed. Items are built lazily, so each one plays its
/// entrance animation as it scrolls onto the screen.
class Feed extends StatelessWidget {
  const Feed({super.key, required this.content});
  final Map<String, dynamic> content;

  @override
  Widget build(BuildContext context) {
    final stats = (content['stats'] as List).cast<Map<String, dynamic>>();
    final latest = (content['latest'] as List).cast<Map<String, dynamic>>();
    final datasets = (content['datasets'] as List).cast<Map<String, dynamic>>();
    final snapshot = content['snapshot'] as Map<String, dynamic>;

    final items = <Widget>[
      const _Notice(),
      Text(content['headline'] as String,
          style: const TextStyle(fontSize: 34, height: 1.08, fontWeight: FontWeight.w600, color: ink, letterSpacing: -0.6)),
      Text(content['lede'] as String, style: const TextStyle(fontSize: 17, height: 1.5, color: bodyColor)),
      const SectionTitle('Key trends at a glance'),
      for (final s in stats) StatCard(stat: s),
      SectionTitle(snapshot['title'] as String),
      TrendChart(
        growthPerYear: (snapshot['growthPerYear'] as num).toDouble(),
        quarters: (snapshot['quarters'] as List).cast<String>(),
      ),
      const SectionTitle('Our latest work'),
      for (final l in latest) LatestTile(item: l),
      const SectionTitle('Discover more data'),
      for (final d in datasets) DatasetTile(item: d),
      const SizedBox(height: 24),
    ];

    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
      itemCount: items.length,
      itemBuilder: (context, i) => Padding(
        padding: const EdgeInsets.only(bottom: 14),
        child: Entrance(child: items[i]),
      ),
    );
  }
}

/// Fade + rise + zoom-in, played once when the widget is first built.
class Entrance extends StatefulWidget {
  const Entrance({super.key, required this.child});
  final Widget child;

  @override
  State<Entrance> createState() => _EntranceState();
}

class _EntranceState extends State<Entrance> with SingleTickerProviderStateMixin {
  late final AnimationController _controller =
      AnimationController(vsync: this, duration: const Duration(milliseconds: 650));
  late final Animation<double> _curve = CurvedAnimation(parent: _controller, curve: Curves.easeOutCubic);
  bool _started = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_started) return;
    _started = true;
    // Respect the system "reduce motion" setting.
    if (MediaQuery.of(context).disableAnimations) {
      _controller.value = 1;
    } else {
      _controller.forward();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _curve,
      child: SlideTransition(
        position: Tween<Offset>(begin: const Offset(0, 0.12), end: Offset.zero).animate(_curve),
        child: ScaleTransition(
          scale: Tween<double>(begin: 0.92, end: 1).animate(_curve),
          child: widget.child,
        ),
      ),
    );
  }
}

class _Notice extends StatelessWidget {
  const _Notice();

  @override
  Widget build(BuildContext context) {
    return const Text(
      'Unofficial redesign concept. Not affiliated with or endorsed by Epoch AI.',
      style: TextStyle(fontSize: 13, color: muted),
    );
  }
}

class SectionTitle extends StatelessWidget {
  const SectionTitle(this.text, {super.key});
  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 22),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Semantics(
            header: true,
            child: Text(text,
                style: const TextStyle(fontSize: 24, height: 1.15, fontWeight: FontWeight.w600, color: ink)),
          ),
          const SizedBox(height: 10),
          Container(width: 56, height: 3, color: teal600),
        ],
      ),
    );
  }
}

/// The big number. Counts up from zero unless [animate] is false.
class Figure extends StatelessWidget {
  const Figure({super.key, required this.stat, this.size = 40, this.animate = true});
  final Map<String, dynamic> stat;
  final double size;
  final bool animate;

  @override
  Widget build(BuildContext context) {
    final value = (stat['value'] as num).toDouble();
    final decimals = stat['decimals'] as int;
    final still = !animate || MediaQuery.of(context).disableAnimations;
    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: still ? value : 0, end: value),
      duration: Duration(milliseconds: still ? 0 : 1400),
      curve: Curves.easeOutCubic,
      builder: (context, v, _) => Text(
        '${stat['prefix']}${v.toStringAsFixed(decimals)}${stat['suffix']}',
        semanticsLabel: '${stat['prefix']}${value.toStringAsFixed(decimals)}${stat['suffix']} ${stat['unit']}',
        style: TextStyle(fontSize: size, height: 1, fontWeight: FontWeight.w600, color: ink, letterSpacing: -0.8),
      ),
    );
  }
}

class StatCard extends StatelessWidget {
  const StatCard({super.key, required this.stat});
  final Map<String, dynamic> stat;

  void _open(BuildContext context) {
    // Zoom transition into the detail screen; the number flies across (Hero).
    Navigator.of(context).push(PageRouteBuilder<void>(
      transitionDuration: const Duration(milliseconds: 450),
      pageBuilder: (_, __, ___) => StatDetail(stat: stat),
      transitionsBuilder: (_, animation, __, child) {
        final curved = CurvedAnimation(parent: animation, curve: Curves.easeOutCubic);
        return FadeTransition(
          opacity: curved,
          child: ScaleTransition(scale: Tween<double>(begin: 0.9, end: 1).animate(curved), child: child),
        );
      },
    ));
  }

  @override
  Widget build(BuildContext context) {
    final color = hexColor(stat['color'] as String);
    return Material(
      color: Colors.white,
      shape: RoundedRectangleBorder(side: const BorderSide(color: line), borderRadius: BorderRadius.circular(10)),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () => _open(context),
        child: Padding(
          padding: const EdgeInsets.all(18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(children: [
                Container(width: 10, height: 10, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(stat['label'] as String,
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: ink)),
                ),
              ]),
              const SizedBox(height: 12),
              Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Hero(
                    tag: 'fig-${stat['label']}',
                    child: Material(type: MaterialType.transparency, child: Figure(stat: stat)),
                  ),
                  const SizedBox(width: 6),
                  Padding(
                    padding: const EdgeInsets.only(bottom: 4),
                    child: Text(stat['unit'] as String, style: const TextStyle(fontSize: 15, color: muted)),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Text(stat['text'] as String, style: const TextStyle(fontSize: 15, height: 1.45, color: bodyColor)),
              const Divider(height: 26, color: line),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(stat['ciLabel'] as String, style: const TextStyle(fontSize: 13, color: muted)),
                  Text(stat['ci'] as String,
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: bodyColor)),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class StatDetail extends StatelessWidget {
  const StatDetail({super.key, required this.stat});
  final Map<String, dynamic> stat;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(stat['label'] as String, style: const TextStyle(fontSize: 18))),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Hero(
              tag: 'fig-${stat['label']}',
              child: Material(type: MaterialType.transparency, child: Figure(stat: stat, size: 84, animate: false)),
            ),
            const SizedBox(height: 6),
            Text(stat['unit'] as String, style: const TextStyle(fontSize: 20, color: muted)),
            const SizedBox(height: 20),
            Text(stat['text'] as String, style: const TextStyle(fontSize: 19, height: 1.5, color: bodyColor)),
            const Divider(height: 40, color: line),
            Text('${stat['ciLabel']}: ${stat['ci']}',
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: ink)),
          ],
        ),
      ),
    );
  }
}

/// Bars that grow from the baseline, one after another.
class TrendChart extends StatelessWidget {
  const TrendChart({super.key, required this.growthPerYear, required this.quarters});
  final double growthPerYear;
  final List<String> quarters;

  @override
  Widget build(BuildContext context) {
    final values = [for (var i = 0; i < quarters.length; i++) math.pow(growthPerYear, i / 4).toDouble()];
    final maxValue = values.last;
    final still = MediaQuery.of(context).disableAnimations;
    return Semantics(
      label: 'Bar chart. Fitted trend rising from 1 in ${quarters.first} to '
          '${maxValue.toStringAsFixed(1)} in ${quarters.last}, at $growthPerYear times per year.',
      child: ExcludeSemantics(
        child: Container(
          height: 200,
          padding: const EdgeInsets.fromLTRB(14, 16, 14, 12),
          decoration: BoxDecoration(border: Border.all(color: line), borderRadius: BorderRadius.circular(10)),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              for (var i = 0; i < values.length; i++)
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 3),
                    child: TweenAnimationBuilder<double>(
                      tween: Tween<double>(begin: still ? 1 : 0, end: 1),
                      duration: Duration(milliseconds: still ? 0 : 700 + i * 90),
                      curve: Curves.easeOutCubic,
                      builder: (context, t, _) => FractionallySizedBox(
                        heightFactor: (values[i] / maxValue) * t,
                        alignment: Alignment.bottomCenter,
                        child: Container(
                          decoration: const BoxDecoration(
                            color: teal600,
                            borderRadius: BorderRadius.vertical(top: Radius.circular(2)),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

class LatestTile extends StatelessWidget {
  const LatestTile({super.key, required this.item});
  final Map<String, dynamic> item;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.only(top: 12),
      decoration: const BoxDecoration(border: Border(top: BorderSide(color: line))),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('${(item['tag'] as String).toUpperCase()}  ·  ${item['date']}',
              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: teal700, letterSpacing: 0.5)),
          const SizedBox(height: 6),
          Text(item['title'] as String,
              style: const TextStyle(fontSize: 18, height: 1.3, fontWeight: FontWeight.w600, color: ink)),
        ],
      ),
    );
  }
}

class DatasetTile extends StatelessWidget {
  const DatasetTile({super.key, required this.item});
  final Map<String, dynamic> item;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(border: Border.all(color: line), borderRadius: BorderRadius.circular(10)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(width: 36, height: 5, color: hexColor(item['color'] as String)),
          const SizedBox(height: 14),
          Text(item['title'] as String, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w600, color: ink)),
          const SizedBox(height: 4),
          Text(item['text'] as String, style: const TextStyle(fontSize: 15, color: muted)),
        ],
      ),
    );
  }
}
