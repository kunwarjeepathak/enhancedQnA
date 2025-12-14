declare module 'mermaid';
export interface SubItemData {
question: string;
answerMd: string;
images?: string[]; // Array of image URLs or relative paths
}

export interface QACardData {
category: string;
title: string;
subItems: SubItemData[];
}

const data: QACardData[] = [
{
category: 'java',
title: 'Multithreading',
subItems: [
{
question: 'Thread Lifecycle?',
answerMd: `
### Thread Lifecycle Explained

Understanding Thread Lifecycle is crucial for building robust, high-performance concurrent applications. We'll explore both OS-level and JVM perspectives.

\`\`\`mermaid
stateDiagram-v2
[*] --> NEW
NEW --> RUNNABLE: start()
RUNNABLE --> BLOCKED: lock contention
BLOCKED --> RUNNABLE: lock release
RUNNABLE --> WAITING: wait()/join()/park()
WAITING --> RUNNABLE: notify()/timeout/unpark
RUNNABLE --> TERMINATED: run() completes
\`\`\`

🚦 **State Transitions**

| From    | To             | Trigger                              |
|---------|----------------|--------------------------------------|
| NEW     | RUNNABLE       | \`start()\` called                   |
| RUNNABLE| RUNNING        | Scheduler selects thread             |
| RUNNING | BLOCKED        | synchronized block contention        |
| BLOCKED | RUNNABLE       | lock released                        |
| RUNNING | WAITING        | wait()/join() (no timeout)/park()    |
| RUNNING | TIMED_WAITING  | sleep(), wait(timeout), parkNanos()  |
| WAITING | RUNNABLE       | notify(), notifyAll(), unpark()      |
| RUNNING | TERMINATED     | run() completes or exception thrown  |

### Common APIs by State

- **Creating thread**: \`new Thread(runnable)\`
- **Starting**: \`thread.start()\`
- **Blocking on lock**: \`synchronized(obj)\`, \`ReentrantLock.lock()\`
- **Waiting**: \`obj.wait()\`, \`LockSupport.park()\`
- **Timed wait**: \`Thread.sleep(ms)\`, \`obj.wait(ms)\`
- **Notify**: \`obj.notify()\`, \`LockSupport.unpark(thread)\`
- **Termination**: thread finishes \`run()\` or throws uncaught exception.
`
},
// Find the “Multithreading” topic in your src/qa-data.ts and append this entry
{
question: "Why Executor Framework came into picture? What problem was there in JDK 4 which it solved?",
answerMd: `
### Why Executor Framework Came Into Picture

#### 🚫 Problems in JDK 4 (Before Executor)
- Manual thread creation: \`new Thread(r).start()\` used everywhere
- No pooling: Threads were not reused, causing overhead
- Complex coordination: Developers had to manage queues & lifecycle manually
- Error handling issues: No standard way to capture task exceptions
- No tuning or monitoring: Threads couldn’t be controlled or inspected easily

#### ✅ What Executor Framework Solved (JDK 5+)
It decouples task submission from execution, allowing better scalability and control.

| Pain Point            | Executor Solution                         |
|-----------------------|-------------------------------------------|
| Thread explosion      | Thread reuse via pooling                  |
| Manual thread control | ExecutorService abstracts lifecycle       |
| Complex shutdown      | \`shutdown()\`, \`awaitTermination()\`     |
| No queuing            | Built-in task queues (e.g. BlockingQueue) |
| No error visibility   | Future captures exceptions                |
| No scalability        | Flexible pool sizing & scheduling         |

#### 🎯 Code Comparison

~~~java
// Before (JDK 4):
Thread t = new Thread(() -> {
// Task logic
});
t.start();

// After (JDK 5+):
ExecutorService pool = Executors.newFixedThreadPool(4);
pool.submit(() -> {
// Task logic
});
pool.shutdown();
~~~

### Why CompletableFuture Came Into Picture

#### 🚫 Limitations in Executor Framework
- Blocking with Future: Needed \`.get()\` to retrieve result (synchronously)
- No fluent chaining: Couldn’t link multiple tasks together
- Poor error handling: Had to use try/catch blocks externally
- No pipeline creation: No way to compose multiple async stages

#### ✅ How CompletableFuture Solves It
Introduced in Java 8, CompletableFuture lets you build non-blocking asynchronous pipelines with fluent APIs. It’s built on top of the Executor framework—but adds composition and exception handling.

| Component       | Purpose                          | Example                                               |
|-----------------|----------------------------------|-------------------------------------------------------|
| supplyAsync()   | Start task that returns a result | \`CompletableFuture.supplyAsync(() -> getData())\`   |
| thenApply()     | Transform result                 | \`.thenApply(data => process(data))\`                |
| thenCompose()   | Flat-map chained async calls     | \`.thenCompose(this::fetchMore)\`                    |
| exceptionally() | Graceful error handling          | \`.exceptionally(ex => fallback())\`                 |
| allOf()/anyOf() | Combine multiple futures         | \`CompletableFuture.allOf(f1, f2)\`                  |

#### 📈 Async Pipeline Flow

~~~text
[start]
|
v
[supplyAsync()] ---> [thenApply()] ---> [thenCompose()]
|                     |                     |
v                     v                     v
[exceptionally()] --> [handle()] --> [complete()]
~~~

#### 🔧 Sample Comparison

~~~java
// Executor + Future:
Future<Integer> f = pool.submit(() -> fetch());
int result = f.get(); // blocks

// CompletableFuture:
CompletableFuture.supplyAsync(() -> fetch())
.thenApply(data -> transform(data))
.exceptionally(ex -> fallback())
.thenAccept(System.out::println);
~~~
`
},
{
question: 'What’s new in CompletableFuture?',
answerMd: `
CompletableFuture in Java 8+ supports building async pipelines: \`thenApplyAsync\`, \`thenCombine\`, \`exceptionally\`, \`allOf\`/ \`anyOf\`, etc.
`
},
{
question: 'How do you handle thread safety?',
answerMd: `
Use synchronized blocks, locks (\`ReentrantLock\`), concurrent collections, or atomic classes (\`AtomicInteger\`, \`AtomicReference\`) to coordinate access.
`
}
]
},
{
category: 'java',
title: 'String Based Questions',
subItems: [
// To add under your desired Topic’s `subQuestions` array in src/qa-data.ts:
{
question: "How do you print all words that appear more than once using only basic for loops (no maps/collections)?",
answerMd: `
### Explanation

We detect duplicates by:

1. Normalizing the input (convert to lowercase).
2. Splitting into words with \`String#split("\\\\s+")\`.
3. For each word at index *i*:
- Skip it if it already appeared in any index \< *i* (to avoid repeats).
- Count how many times it occurs in the full array.
- If count > 1, print it.

This uses only primitive arrays and loops—no Maps or Collections.

---

### Code

~~~java
public class SimpleRepeatFinder {
public static void main(String[] args) {
String input = "hi hello hello hi i am doing fine";
// Normalize and split by whitespace
        String[] words = input.toLowerCase().split("\\s+");

System.out.println("Repeated words:");

for (int i = 0; i < words.length; i++) {
// Skip if this word already appeared before index i
            boolean alreadySeen = false;
for (int k = 0; k < i; k++) {
if (words[i].equals(words[k])) {
alreadySeen = true;
break;
}
}
if (alreadySeen) continue;

// Count occurrences of words[i]
            int count = 0;
for (int j = 0; j < words.length; j++) {
if (words[i].equals(words[j])) {
count++;
}
}

if (count > 1) {
System.out.println(words[i]);
}
}
}
}
~~~

---

### Output

~~~text
Repeated words:
hi
hello
~~~
`
},// Add this under the “String Based Questions” card’s subItems array

{
question: "How do you print all words that appear more than once using Java Streams?",
answerMd: `
### Explanation

We take the input string, split it into words, normalize to lowercase, then use Streams to:

1. Group words and count occurrences with \`Collectors.groupingBy(..., Collectors.counting())\`.
2. Filter entries whose count is greater than 1.
3. Collect the result into a Map of duplicates.

---

### Code

\`\`\`java
import java.util.*;
import java.util.function.Function;
import java.util.stream.*;

public class DuplicateWordCounter {
public static void main(String[] args) {
String text = "hi hello hello hi i am doing fine";

Map<String, Long> duplicates = Arrays.stream(text.split("\\\\s+"))
.map(String::toLowerCase)
.collect(Collectors.groupingBy(
Function.identity(),
Collectors.counting()
))
.entrySet().stream()
.filter(e -> e.getValue() > 1)
.collect(Collectors.toMap(
Map.Entry::getKey,
Map.Entry::getValue
));

System.out.println("Words occurring more than once: " + duplicates);
}
}
\`\`\`

---

### Output

\`\`\`
Words occurring more than once: {hi=2, hello=2}
\`\`\`
`
},// Add this under the “String Based Questions” card’s subItems array

{
question: "How do you print all circular substrings of a word (e.g. “abc” → a, ab, bc, ca, bca, cab) using simple loops and Java Streams?",
answerMd: `
### Explanation

We treat the input as a circular string by appending it to itself.
Then for each start index \(i\) in \[0…N-1\] and each length \(len\) in \[1…N\], we extract the substring of length \(len\) starting at \(i\).
Using a Set removes duplicates and preserves insertion order.

---

### Simple For Loops

\`\`\`java
import java.util.*;

public class CircularSubstrings {
public static void main(String[] args) {
String s = "abc";
int n = s.length();
String circular = s + s;              // "abcabc"
        Set<String> results = new LinkedHashSet<>();

for (int i = 0; i < n; i++) {
for (int len = 1; len <= n; len++) {
results.add(circular.substring(i, i + len));
}
}

// Print in insertion order
        results.forEach(System.out::println);
}
}
\`\`\`

---

### Java Streams

\`\`\`java
import java.util.*;
import java.util.stream.*;

public class CircularSubstringsStream {
public static void main(String[] args) {
String s = "abc";
int n = s.length();
String circular = s + s;

List<String> results = IntStream.range(0, n)
.boxed()
.flatMap(i -> IntStream.rangeClosed(1, n)
.mapToObj(len -> circular.substring(i, i + len)))
.distinct()
.collect(Collectors.toList());

results.forEach(System.out::println);
}
}
\`\`\`

---

### Output

\`\`\`
a
ab
abc
b
bc
bca
c
ca
cab
\`\`\`
`
},// To add under your desired Topic’s `subItems` array in src/qa-data.ts:
{
question: "How do you find the 2nd largest number in an array using simple loops and Java Streams?",
answerMd: `

### Explanation

We want the second highest distinct value in the array.

---

### Simple For Loops

\`\`\`java
public class SecondLargest {
public static int findSecondLargest(int[] arr) {
if (arr == null || arr.length < 2) {
throw new IllegalArgumentException("Array must contain at least two elements");
}
int first = Integer.MIN_VALUE;
int second = Integer.MIN_VALUE;
for (int num : arr) {
if (num > first) {
second = first;
first = num;
} else if (num > second && num < first) {
second = num;
}
}
if (second == Integer.MIN_VALUE) {
throw new NoSuchElementException("No second largest element");
}
return second;
}

public static void main(String[] args) {
int[] arr = {5, 1, 4, 2, 3};
System.out.println(findSecondLargest(arr)); // 4
    }
}
\`\`\`

---

### Java Streams

\`\`\`java
import java.util.*;
import java.util.stream.*;

public class SecondLargestStream {
public static int findSecondLargest(int[] arr) {
return Arrays.stream(arr)
.distinct()
.boxed()
.sorted(Comparator.reverseOrder())
.skip(1)
.findFirst()
.orElseThrow(() -> new NoSuchElementException("No second largest element"));
}

public static void main(String[] args) {
int[] arr = {5, 1, 4, 2, 3};
System.out.println(findSecondLargest(arr)); // 4
    }
}
\`\`\`

---

### Complexity

- Simple loops: O(n) time, O(1) extra space
- Streams: O(n log n) time due to sorting, extra space for boxing and distinct
`
},// To add under your desired Topic’s `subItems` array in src/qa-data.ts:
{
question: "How do you find the next immediate bigger number by reordering digits (e.g. i/p: 1234 → o/p: 1243) using simple loops and Java Streams?",
answerMd: `

### Explanation

We want the next lexicographical permutation of the digits.
1. Scan from right to left to find the first index \`i\` where \`digits[i] < digits[i+1]\` (the pivot).
2. Scan from the end to find the smallest digit greater than \`digits[i]\`, call its index \`j\`.
3. Swap \`digits[i]\` and \`digits[j]\`.
4. Reverse the subarray to the right of index \`i\` to get the next permutation.

---

### Simple For Loops

\`\`\`java
import java.util.Arrays;

public class NextPermutation {
public static int[] nextBigger(int[] arr) {
int n = arr.length;
// 1. Find pivot
        int i = n - 2;
while (i >= 0 && arr[i] >= arr[i + 1]) {
i--;
}
if (i < 0) {
// Highest permutation; no bigger number
            return arr;
}
// 2. Find rightmost successor
        int j = n - 1;
while (arr[j] <= arr[i]) {
j--;
}
// 3. Swap pivot with successor
        swap(arr, i, j);
// 4. Reverse suffix
        reverse(arr, i + 1, n - 1);
return arr;
}

private static void swap(int[] a, int i, int j) {
int t = a[i];
a[i] = a[j];
a[j] = t;
}

private static void reverse(int[] a, int lo, int hi) {
while (lo < hi) {
swap(a, lo++, hi--);
}
}

public static void main(String[] args) {
int[] digits = {1, 2, 3, 4};
int[] next = nextBigger(digits);
System.out.println(Arrays.toString(next)); // [1, 2, 4, 3]
    }
}
\`\`\`

---

### Java Streams (Generate & Filter)

Here we generate all permutations via recursion in a Stream, then pick the smallest one greater than the input.

\`\`\`java
import java.util.Comparator;
import java.util.stream.*;

public class NextPermutationStream {
// Generate all permutations of s as Stream<String>
    static Stream<String> permutations(String s) {
if (s.isEmpty()) {
return Stream.of("");
}
return IntStream.range(0, s.length())
.boxed()
.flatMap(i -> {
char ch = s.charAt(i);
String rem = s.substring(0, i) + s.substring(i + 1);
return permutations(rem)
.map(p -> ch + p);
});
}

public static String nextBigger(String s) {
return permutations(s)
.distinct()
.filter(p -> p.compareTo(s) > 0)
.min(Comparator.naturalOrder())
.orElse("No bigger permutation");
}

public static void main(String[] args) {
String input = "1234";
String next = nextBigger(input);
System.out.println(next); // 1243
    }
}
\`\`\`

---

### Example Output

\`\`\`
[1, 2, 4, 3]
1243
\`\`\`
`
},// To add under your desired Topic’s `subItems` array in src/qa-data.ts:
{
question: "Given a String \"Kunwar jee Pathak\", print output as \"Kunwr j Pthk\" by removing all characters that occur more than once (spaces preserved).",
answerMd: `

### Explanation

We want to remove every character (except spaces) that appears more than once in the entire string.
1. First pass: count frequencies of non-space characters.
2. Second pass: build the result by including a character if it is a space or its frequency is exactly one.

---

### Simple For Loops

\`\`\`java
import java.util.*;

public class UniqueCharFilter {
public static String removeDuplicates(String input) {
// 1. Count frequencies (ignore spaces)
        Map<Character, Integer> freq = new HashMap<>();
for (char c : input.toCharArray()) {
if (c != ' ') {
freq.put(c, freq.getOrDefault(c, 0) + 1);
}
}

// 2. Build output, keeping spaces and chars with freq == 1
        StringBuilder sb = new StringBuilder();
for (char c : input.toCharArray()) {
if (c == ' ' || freq.getOrDefault(c, 0) == 1) {
sb.append(c);
}
}
return sb.toString();
}

public static void main(String[] args) {
String s = "Kunwar jee Pathak";
System.out.println(removeDuplicates(s));  // Kunwr j Pthk
    }
}
\`\`\`

---

### Java Streams

\`\`\`java
import java.util.*;
import java.util.function.Function;
import java.util.stream.*;

public class UniqueCharFilterStream {
public static String removeDuplicates(String input) {
// 1. Build frequency map of non-space chars
        Map<Integer, Long> freq = input.chars()
.filter(ch -> ch != ' ')
.boxed()
.collect(Collectors.groupingBy(
Function.identity(),
Collectors.counting()
));

// 2. Reconstruct string, keeping spaces or chars with freq == 1
        return input.chars()
.filter(ch -> ch == ' ' || freq.getOrDefault(ch, 0L) == 1L)
.mapToObj(c -> String.valueOf((char)c))
.collect(Collectors.joining());
}

public static void main(String[] args) {
String s = "Kunwar jee Pathak";
System.out.println(removeDuplicates(s));  // Kunwr j Pthk
    }
}
\`\`\`

---

### Output

\`\`\`
Kunwr j Pthk
\`\`\`
`
},
{
question: 'What’s the difference between StringBuilder and StringBuffer?',
answerMd: `
StringBuffer is synchronized (thread-safe) but slower. StringBuilder is unsynchronized and faster for single-thread use.
`
},
{
question: 'How do you reverse a String?',
answerMd: `
Use \`new StringBuilder(str).reverse().toString()\` or write a loop swapping characters in a \`char[]\`.
`
}
]
},// Add this as the third card in your src/qa-data.ts

{
category: 'java',
title: 'Java Streams',
subItems: [
{
question: 'How do you filter, map, and collect elements from a List using Streams?',
answerMd: `
### Explanation

We start from a List, convert it to a Stream, then apply:
1. \`filter\` to drop unwanted elements.
2. \`map\` to transform each element.
3. \`collect\` to gather the results back into a new List.

---

### Code

\`\`\`java
import java.util.*;
import java.util.stream.*;

public class FilterMapCollect {
public static void main(String[] args) {
List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");

List<String> result = names.stream()
.filter(s -> s.length() <= 4)       // keep names of length ≤ 4
            .map(String::toUpperCase)           // uppercase each name
            .collect(Collectors.toList());      // collect into a List

System.out.println(result);          // [ALICE, BOB]
    }
}
\`\`\`

---

### Output

\`\`\`
[ALICE, BOB]
\`\`\`
`
},
{
question: 'How do you flatMap a List of Lists into a single Stream?',
answerMd: `
### Explanation

A nested List (List<List<T>>) can be flattened by:
1. Calling \`stream()\` on the outer List.
2. \`flatMap\` each inner List’s stream into one continuous Stream.
3. Continue processing or collect.

---

### Code

\`\`\`java
import java.util.*;
import java.util.stream.*;

public class FlatMapExample {
public static void main(String[] args) {
List<List<Integer>> matrix = List.of(
List.of(1, 2),
List.of(3, 4, 5),
List.of(6)
);

List<Integer> flat = matrix.stream()
.flatMap(Collection::stream)        // flatten nested lists
            .collect(Collectors.toList());

System.out.println(flat);            // [1, 2, 3, 4, 5, 6]
    }
}
\`\`\`

---

### Output

\`\`\`
[1, 2, 3, 4, 5, 6]
\`\`\`
`
},
{
question: 'How do you group elements by a property using \`Collectors.groupingBy\`?',
answerMd: `
### Explanation

\`groupingBy\` partitions elements into a Map where:
- Key = result of a classifier function.
- Value = List (or another downstream collection) of elements sharing that key.

---

### Code

\`\`\`java
import java.util.*;
import java.util.stream.*;

public class GroupingByExample {
public static void main(String[] args) {
List<String> words = List.of("apple", "ant", "banana", "bat", "carrot");

Map<Character, List<String>> byInitial = words.stream()
.collect(Collectors.groupingBy(s -> s.charAt(0)));

System.out.println(byInitial);
// {a=[apple, ant], b=[banana, bat], c=[carrot]}
    }
}
\`\`\`

---

### Output

\`\`\`
{a=[apple, ant], b=[banana, bat], c=[carrot]}
\`\`\`
`
},
{
question: 'How do you partition elements into two groups with \`Collectors.partitioningBy\`?',
answerMd: `
### Explanation

\`partitioningBy\` splits elements into a \`Map<Boolean, List<T>>\`:
- \`true\` key holds elements matching the predicate.
- \`false\` key holds the rest.

---

### Code

\`\`\`java
import java.util.*;
import java.util.stream.*;

public class PartitioningExample {
public static void main(String[] args) {
List<Integer> nums = List.of(1, 2, 3, 4, 5, 6);

Map<Boolean, List<Integer>> parts = nums.stream()
.collect(Collectors.partitioningBy(n -> n % 2 == 0));

System.out.println("Even: " + parts.get(true));   // [2, 4, 6]
        System.out.println("Odd: "  + parts.get(false));  // [1, 3, 5]
    }
}
\`\`\`

---

### Output

\`\`\`
Even: [2, 4, 6]
Odd: [1, 3, 5]
\`\`\`
`
},
{
question: 'How do you summarize numeric data (count, sum, avg, min, max)?',
answerMd: `
### Explanation

\`Collectors.summarizingInt/Long/Double\` produces an \`IntSummaryStatistics\` (or equivalent) with count, sum, min, max, and average.

---

### Code

\`\`\`java
import java.util.*;
import java.util.stream.*;

public class SummarizingExample {
public static void main(String[] args) {
List<Integer> nums = List.of(2, 4, 6, 8, 10);

IntSummaryStatistics stats = nums.stream()
.collect(Collectors.summarizingInt(Integer::intValue));

System.out.println("Count: " + stats.getCount());
System.out.println("Sum:   " + stats.getSum());
System.out.println("Avg:   " + stats.getAverage());
System.out.println("Min:   " + stats.getMin());
System.out.println("Max:   " + stats.getMax());
}
}
\`\`\`

---

### Output

\`\`\`
Count: 5
Sum:   30
Avg:   6.0
Min:   2
Max:   10
\`\`\`
`
},
{
question: 'How do you create and limit an infinite Stream?',
answerMd: `
### Explanation

Use \`Stream.iterate\` or \`Stream.generate\` to build infinite streams, then apply \`limit(n)\` to cap size.

---

### Code

\`\`\`java
import java.util.stream.*;

public class InfiniteStreamExample {
public static void main(String[] args) {
List<Long> firstTen = Stream.iterate(1L, n -> n + 1)
.limit(10)                         // take first 10 values
            .collect(Collectors.toList());

System.out.println(firstTen);        // [1, 2, …, 10]
    }
}
\`\`\`

---

### Output

\`\`\`
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
\`\`\`
`
},
{
question: 'How do you collect into a Map with custom merge behavior?',
answerMd: `
### Explanation

When keys collide, supply a merge function to define how values combine.

---

### Code

\`\`\`java
import java.util.*;
import java.util.stream.*;

public class ToMapMergeExample {
public static void main(String[] args) {
String[] data = {"a=1", "b=2", "a=3"};

Map<String, Integer> map = Arrays.stream(data)
.map(s -> s.split("="))
.collect(Collectors.toMap(
arr -> arr[0],                       // key
                arr -> Integer.parseInt(arr[1]),     // value
                Integer::sum                         // merge 1 + 3 = 4
            ));

System.out.println(map);                 // {a=4, b=2}
    }
}
\`\`\`

---

### Output

\`\`\`
{a=4, b=2}
\`\`\`
`
},
{
question: 'When should you use parallel streams and what are the caveats?',
answerMd: `
### Explanation

Parallel streams split the workload across threads. Use when:
- Large data sets.
- Stateless, side-effect-free operations.
- You have enough CPU cores.

**Caveats**
- Overhead of thread management can outweigh gains on small data.
- Must avoid mutable shared state.
- Order of results may differ (use \`forEachOrdered\` if needed).

---

### Code

\`\`\`java
import java.util.*;
import java.util.stream.*;

public class ParallelStreamExample {
public static void main(String[] args) {
List<Integer> nums = IntStream.rangeClosed(1, 1_000_000)
.boxed()
.collect(Collectors.toList());

long sum = nums.parallelStream()
.mapToLong(Integer::longValue)
.sum();

System.out.println("Sum: " + sum);
}
}
\`\`\`
`
}
]
},// Add this as the fourth card in your src/qa-data.ts, right after the “Java Streams” card

{
category: 'java',
title: 'JVM Memory Model',
subItems: [
{
question: 'What are the key changes to JVM memory regions in Java 8 versus Java 7?',
answerMd: `
### Memory Area Changes

Java 8 removed the permanent generation (PermGen) and introduced Metaspace:

- PermGen (Java 7):
- Fixed‐size heap region for class metadata, interned Strings, static variables
- Often led to \`java.lang.OutOfMemoryError: PermGen space\`
- Metaspace (Java 8):
- Class metadata moved to native (off‐heap) memory
- Grows dynamically (bounded only by \`-XX:MaxMetaspaceSize\`)
- Reduces GC overhead and fragmentation

---

#### Configuration Comparison

| Configuration Flag            | Java 7 (PermGen)           | Java 8 (Metaspace)              |
|-------------------------------|----------------------------|---------------------------------|
| Initial size                  | \`-XX:PermSize\`           | \`-XX:MetaspaceSize\`           |
| Maximum size                  | \`-XX:MaxPermSize\`        | \`-XX:MaxMetaspaceSize\`        |
| Out-of-memory error           | PermGen space exhaustion   | Metaspace exhaustion            |
`
},
{
question: 'How did garbage collection improve in Java 8?',
answerMd: `
### GC Enhancements

Java 8 delivered multiple GC‐level improvements over Java 7:

- G1 Enhancements
- Graduated from experimental to production‐quality
- Improved pause predictability and throughput
- **String Deduplication** (since 8u20): dedups duplicate \`char[]\` in heap to shrink footprint
- CMS & Parallel Full GC
- \`-XX:+CMSParallelRemarkEnabled\` for faster remark phase
- Better adaptive sizing across collectors
- Escape Analysis & Stack Allocation
- \`-XX:+DoEscapeAnalysis\` enables scalar replacement of short‐lived objects
- Further reduces heap allocation pressure

---

#### Tuning Tips

- Switch to G1 by default: \`-XX:+UseG1GC\`
- Enable String dedup: \`-XX:+UseStringDeduplication\`
- Monitor Metaspace: use \`-verbose:gc\`, \`jcmd GC.class_histogram\`
`
},
{
question: 'Did the Java Memory Model (JMM) spec change in Java 8?',
answerMd: `
### JMM Specification

The core JMM (JSR-133) remains unchanged from Java 5 through Java 8:

- **Happens‐before** rules for \`volatile\`, \`synchronized\`, and \`java.util.concurrent\` still apply
- No semantic changes in visibility or ordering guarantees

What did evolve are JVM optimizations (escape analysis, biased‐lock improvements, lock coarsening), which accelerate code under the **same** JMM semantics.
`
}
]
},// Add this card to your src/qa-data.ts

{
category: 'java',
title: 'HashMap Internals & Java 8 Improvements',
subItems: [
{
question: 'How does HashMap work internally?',
answerMd: `
### HashMap Internal Mechanics

- Underlying Data Structure
- Array of buckets, each bucket holds a linked list or tree of \`Node<K,V>\` entries.

- Hashing and Index Calculation
- Key’s \`hashCode()\` is mixed and then masked:
\`index = (capacity – 1) & hash\`.

- Collision Resolution
- Prior to Java 8, collisions form a singly linked list.
- Lookups, insertions, and deletions traverse that list.

- Resizing
- Triggered when \`size > loadFactor * capacity\` (default loadFactor = 0.75).
- Capacity doubles and entries are rehashed into the new bucket array.
`
},
{
question: 'What are the key improvements to HashMap in Java 8?',
answerMd: `
### Java 8 Enhancements

- Treeification of Buckets
- When a bucket’s linked list length exceeds 8 **and** table capacity ≥ 64, it converts the list into a red-black tree.
- Improves worst-case lookups from \`O(n)\` to \`O(log n)\`.

- Balanced Bin Trees
- Tree nodes implement red-black balancing for faster searches, insertions, and deletions.

- Improved Hash Spreading
- Better bit-mixing of \`hashCode()\` reduces collision probability.

- New Compute Methods
- \`computeIfAbsent\`, \`computeIfPresent\`, and \`merge\` allow atomic, lambda-driven updates.

- Overall Performance Gains
- Better distribution, shorter collision chains, and faster read operations in high-collision scenarios.
`
}
]
},// Add this card to your src/qa-data.ts

{
category: 'java',
title: 'Java OOPs Concepts: Core Principles & Examples',
subItems: [
{
question: 'What is Encapsulation in Java and how is it implemented?',
answerMd: `
Encapsulation is the principle of bundling data (fields) and behavior (methods) into a single unit while restricting direct access to some of an object’s components.

Key points:
- Use private fields to hide internal state
- Provide public getters/setters to control and validate access
- Improves maintainability and enforces invariants

Example:
\`\`\`java
public class BankAccount {
private double balance;  // hidden state

    public double getBalance() {
return balance;
}

public void deposit(double amount) {
if (amount > 0) {
balance += amount;
}
}

public void withdraw(double amount) {
if (amount > 0 && amount <= balance) {
balance -= amount;
}
}
}
\`\`\`
`
},
{
question: 'What is Inheritance in Java and how do you use it?',
answerMd: `
Inheritance allows a new class (subclass) to reuse fields and methods of an existing class (superclass), promoting code reuse and a clear type hierarchy.

Key points:
- Use the \`extends\` keyword for classes
- Subclass can override superclass methods to alter behavior
- Java supports single inheritance for classes

Example:
\`\`\`java
// Superclass
public class Vehicle {
public void start() {
System.out.println("Vehicle started");
}
}

// Subclass
public class Car extends Vehicle {
@Override
public void start() {
System.out.println("Car engine started");
}
}
\`\`\`
`
},
{
question: 'How does compile-time polymorphism (method overloading) work in Java?',
answerMd: `
Compile-time polymorphism, or method overloading, happens when multiple methods share the same name but differ in parameter lists. The compiler resolves which method to call based on argument types.

Key points:
- Same method name, different signatures
- Resolved at compile time
- Enhances readability and API usability

Example:
\`\`\`java
public class MathUtils {
public int add(int a, int b) {
return a + b;
}

public double add(double a, double b) {
return a + b;
}

public int add(int a, int b, int c) {
return a + b + c;
}
}
\`\`\`
`
},
{
question: 'How does runtime polymorphism (method overriding) work in Java?',
answerMd: `
Runtime polymorphism, or method overriding, occurs when a subclass provides its own implementation of a method declared in its superclass. The JVM decides which method to invoke at runtime.

Key points:
- Same method signature in subclass
- Resolved at runtime via dynamic dispatch
- Enables flexible and extensible designs

Example:
\`\`\`java
public class Animal {
public void speak() {
System.out.println("Animal makes a sound");
}
}

public class Dog extends Animal {
@Override
public void speak() {
System.out.println("Dog barks");
}
}

// Usage
Animal myPet = new Dog();
myPet.speak();  // prints "Dog barks"
\`\`\`
`
},
{
question: 'What is Abstraction in Java and how do you implement it?',
answerMd: `
Abstraction focuses on exposing only the essential features of an object while hiding implementation details.

Key points:
- Achieved with abstract classes and interfaces
- Abstract classes can have both abstract and concrete methods
- Interfaces define a contract; since Java 8 they can include default and static methods

Abstract class example:
\`\`\`java
public abstract class Shape {
public abstract double area();
public void display() {
System.out.println("Shape displayed");
}
}

public class Circle extends Shape {
private double radius;
public Circle(double radius) {
this.radius = radius;
}
@Override
public double area() {
return Math.PI * radius * radius;
}
}
\`\`\`

Interface example:
\`\`\`java
public interface Flyable {
void fly();
}

public class Bird implements Flyable {
@Override
public void fly() {
System.out.println("Bird is flying");
}
}
\`\`\`
`
}
]
},// Add this as the next card in your src/qa-data.ts

{
category: 'springBoot',
title: 'Spring & Spring Boot Deep Dive',
subItems: [
{
question: 'How does Spring Boot Auto-Configuration actually find and apply beans?',
answerMd: `
### Under-the-Hood of Auto-Configuration

1. **spring.factories**
- Spring Boot scans all JARs on the classpath for \`META-INF/spring.factories\`.
- Each \`EnableAutoConfiguration\` entry lists one @Configuration class.

2. **Conditional Annotations**
- \`@ConditionalOnClass\`, \`@ConditionalOnMissingBean\`, \`@ConditionalOnProperty\`, etc.
- Conditions evaluated at startup; only matching configurations are registered.

3. **Ordering & Overrides**
- User-defined \`@Configuration\` beans (in your code) are processed *before* auto-configurations.
- You can override any auto bean simply by declaring your own.

---

**Tip:** To inspect which auto-configs ran, enable
\`--debug\` or set \`logging.level.org.springframework.boot.autoconfigure=TRACE\`.
`
},
{
question: 'Explain how Spring AOP creates proxies and when it uses CGLIB vs JDK proxies.',
answerMd: `
### Proxy Mechanism

- **JDK Dynamic Proxies**
- Used if target bean implements at least one interface.
- Creates a lightweight proxy implementing those interfaces.

- **CGLIB Proxies**
- Used if no interfaces or if \`proxyTargetClass=true\`.
- Subclasses the target class at runtime.

**Lifecycle:**
1. Spring finds all \`@Aspect\` beans and builds advisors.
2. An \`AutoProxyCreator\` intercepts bean creation.
3. Wraps matching beans in a proxy object.

---

**Caveat:**
- Final classes & methods cannot be proxied with CGLIB.
- Avoid stateful advice or shared mutable state inside aspects.
`
},
{
question: 'What is the role of BeanPostProcessor and how can you use it?',
answerMd: `
### BeanPostProcessor Overview

- Invoked **after** bean instantiation & dependency injection but **before** your init-methods.
- Two callbacks:
- \`postProcessBeforeInitialization(Object bean, String name)\`
- \`postProcessAfterInitialization(Object bean, String name)\`

### Use Cases

- Custom annotation handling.
- Wrapping beans in proxies (e.g., for metrics, tracing).
- Injecting dynamic behavior or validating bean properties.

---

\`\`\`java
@Component
public class AuditingProcessor implements BeanPostProcessor {
@Override
public Object postProcessBeforeInitialization(Object bean, String name) {
// inspect or wrap bean
    return bean;
}
}
\`\`\`
`
},
{
question: 'How does Spring’s @Transactional actually work under the covers?',
answerMd: `
### Behind the Scenes of @Transactional

1. **Proxy Creation**
- Spring wraps \`@Transactional\` beans in a proxy (AOP).
2. **TransactionInterceptor**
- Intercepts method calls.
- Begins a transaction before the method, commits/rolls back afterward.

3. **PlatformTransactionManager**
- Delegates to specific implementations (DataSourceTransactionManager, JtaTransactionManager).
- Applies propagation and isolation semantics.

---

**Note:**
- Only public methods called via the Spring proxy will participate.
- Self-invocation (this.someTransactional()) bypasses the proxy.
`
},
{
question: 'What are key differences between Spring Profiles and @Conditional?',
answerMd: `
### Spring Profiles vs @Conditional

| Aspect               | @Profile                    | @Conditional                |
|----------------------|-----------------------------|-----------------------------|
| Activation           | \`spring.profiles.active\`  | No global switch — eval’d per condition |
| Use Case             | Coarse-grained environment configs (dev/prod) | Fine-grained bean registration rules |
| Annotations          | \`@Profile("dev")\`         | \`@ConditionalOnBean\`, \`@ConditionalOnProperty\`, etc. |
| Bean Visibility      | Exclude entire config classes in inactive profiles | Skip individual beans or configurations based on custom logic |

---

**Combine Both:**
You can annotate a @Configuration with @Profile and its beans with more granular @Conditional annotations.
`
},
{
question: 'How do Spring Boot Actuator endpoints get exposed and secured by default?',
answerMd: `
### Actuator Exposure & Security

1. **Endpoints**
- Built-in: \`/actuator/health\`, \`/metrics\`, \`/info\`, etc.
- Enabled when you add \`spring-boot-starter-actuator\`.

2. **Exposure**
- Default: only \`health\` and \`info\` over HTTP.
- Customize via \`management.endpoints.web.exposure.include=\`.

3. **Security**
- Spring Boot 2+ secures all endpoints by default (basic auth).
- Use \`management.endpoints.web.exposure\` and standard Spring Security config to open or protect endpoints.

---

**Example:**
\`\`\`
management.endpoints.web.exposure.include=health,metrics
management.endpoint.health.show-details=always
\`\`\`
`
},
{
question: 'What’s the difference between @RestController and @Controller?',
answerMd: `
### Controller Stereotypes

- **@Controller**
- Marks a Spring MVC controller.
- Methods typically return a view name; data must be placed in a \`Model\`.

- **@RestController**
- Shortcut for \`@Controller + @ResponseBody\`.
- Methods return JSON/XML directly, serialized by HttpMessageConverters.

---

**Example:**

\`\`\`java
@RestController
public class UserApi {
@GetMapping("/user/{id}")
public User getUser(@PathVariable Long id) {
return userService.findById(id);
}
}
\`\`\`
`
}
]
},// Add this as the next card in your src/qa-data.ts

{
category: 'springBoot',
title: 'Spring Bean Scopes: Use Cases & Examples',
subItems: [
{
question: 'What are the six built-in Spring bean scopes and their lifecycles?',
answerMd: `
Spring defines six scopes to control bean instantiation, sharing, and destruction:

| Scope      | Lifecycle                                       |
|------------|-------------------------------------------------|
| singleton  | One instance per Spring container               |
| prototype  | New instance on each lookup/injection           |
| request    | One instance per HTTP request                   |
| session    | One instance per HTTP session                   |
| application| One instance per ServletContext (global web app)|
| websocket  | One instance per WebSocket session              |

Choosing the right scope helps you manage resources, state, and thread-safety in your applications.
`
},
{
question: 'When should I use singleton scope?',
answerMd: `
Singleton is the default. Spring creates one instance at startup (or lazily on first use) and shares it across the entire container.

Use cases:
- Stateless services (business logic, DAOs)
- Shared caches or connection pools

Example:
\`\`\`java
@Service
public class UserService {
public User findById(Long id) { … }
}
\`\`\`

Ensure thread-safety if you hold mutable state.
`
},
{
question: 'When should I use prototype scope?',
answerMd: `
Prototype beans produce a new instance every time you request or inject them.

Use cases:
- Objects carrying temporary or user-specific state
- Heavy-init resources you want fresh each time

Example:
\`\`\`java
@Component
@Scope("prototype")
public class ReportGenerator {
private UUID sessionId = UUID.randomUUID();
}
\`\`\`

Note: Spring does not manage destruction for prototype beans—you must clean up manually if needed.
`
},
{
question: 'When should I use request scope?',
answerMd: `
Request-scoped beans live for a single HTTP request and are destroyed at its end.

Use cases:
- Capturing per-request data (e.g., search criteria, filters)
- Avoiding ThreadLocal for request parameters

Example:
\`\`\`java
@Component
@Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class SearchCriteria {
private String query;
}
\`\`\`

Requires a web-aware ApplicationContext.
`
},
{
question: 'When should I use session scope?',
answerMd: `
Session-scoped beans persist for the lifetime of an HTTP session.

Use cases:
- Shopping carts, multi-step workflows
- User preferences maintained across requests

Example:
\`\`\`java
@Component
@Scope(value = "session", proxyMode = ScopedProxyMode.INTERFACES)
public class ShoppingCart {
private List<Item> items = new ArrayList<>();
}
\`\`\`

Always inject via a proxy when mixing with singletons.
`
},
{
question: 'When should I use application scope?',
answerMd: `
Application-scoped beans live for the entire ServletContext—one instance per web app.

Use cases:
- Global caches or lookup tables
- Shared counters or stats collectors

Example:
\`\`\`java
@Component
@Scope(value = "application", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class GlobalCache {
private Map<String, Object> cache = new ConcurrentHashMap<>();
}
\`\`\`

Often singleton suffices outside web contexts.
`
},
{
question: 'When should I use websocket scope?',
answerMd: `
WebSocket-scoped beans are created per WebSocket session.

Use cases:
- Real-time chat handlers
- Collaborative editing state per connection

Example:
\`\`\`java
@Component
@Scope(value = "websocket", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class ChatSessionHandler {
private String username;
}
\`\`\`

Requires Spring’s WebSocket support and proxy injection.
`
}
]
},// Add this card to your src/qa-data.ts

{
category: 'springBoot',
title: 'Spring Security: Use Cases & Examples',
subItems: [
{
question: 'How does the Spring Security filter chain process incoming requests?',
answerMd: `
### Security Filter Chain

- Spring Security installs a chain of \`Filter\`s that each inspect or modify the request/response.
- Modern style registers one or more \`SecurityFilterChain\` beans instead of extending WebSecurityConfigurerAdapter.
- Each filter does part of authentication or authorization before handing off to the next.

\`\`\`java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
http
.authorizeHttpRequests(auth -> auth
.requestMatchers("/admin/**").hasRole("ADMIN")
.anyRequest().authenticated()
)
.formLogin().and()
.httpBasic();
return http.build();
}
\`\`\`

This single bean wires up all necessary filters in the correct order.
`
},
{
question: 'What’s the difference between form-based login and HTTP Basic auth?',
answerMd: `
### Form Login vs HTTP Basic

- **Form Login**
- Presents a custom HTML login page.
- Session-based, states authenticated user in \`HttpSession\`.
- **HTTP Basic**
- Browser pops up a credentials dialog.
- Credentials sent on every request in \`Authorization: Basic <token>\`.

\`\`\`java
http
.formLogin(form -> form
.loginPage("/login").permitAll()
)
.httpBasic();
\`\`\`

Use form login for interactive UIs; basic auth for simple REST clients.
`
},
{
question: 'How do you hook up a custom UserDetailsService and password encoder?',
answerMd: `
### Custom UserDetailsService

1. Implement \`UserDetailsService\` to load user data (roles, password hash) from your store.
2. Define a \`PasswordEncoder\` bean (e.g., BCrypt).

\`\`\`java
@Service
public class MyUserDetailsService implements UserDetailsService {
@Autowired UserRepository repo;
@Override
public UserDetails loadUserByUsername(String username) {
return repo.findByUsername(username)
.orElseThrow(() -> new UsernameNotFoundException(username));
}
}

@Bean
public PasswordEncoder passwordEncoder() {
return new BCryptPasswordEncoder();
}
\`\`\`
`
},
{
question: 'How can you secure a REST API using JWT for stateless authentication?',
answerMd: `
### JWT-Based Stateless Auth

- On login, generate a signed JWT containing username and roles.
- Client sends JWT in \`Authorization: Bearer <token>\`.
- Use a filter to parse and validate JWT, then populate \`SecurityContext\`.

\`\`\`java
String jwt = Jwts.builder()
.setSubject(user.getUsername())
.claim("roles", roles)
.signWith(key)
.compact();
\`\`\`

Then in a custom filter:
\`\`\`java
var auth = new UsernamePasswordAuthenticationToken(user, null, authorities);
SecurityContextHolder.getContext().setAuthentication(auth);
\`\`\`
`
},
{
question: 'How do you set up OAuth2 login with Google (or another provider)?',
answerMd: `
### OAuth2 Client Login

1. Add \`spring-boot-starter-oauth2-client\`.
2. Configure \`spring.security.oauth2.client.registration.google\` in \`application.yml\`.
3. Enable OAuth2 login in \`SecurityFilterChain\`.

\`\`\`java
http
.oauth2Login(oauth2 -> oauth2
.loginPage("/oauth2/authorization/google")
);
\`\`\`

Spring handles the redirect, token exchange, and maps user info to a \`OAuth2User\`.
`
},
{
question: 'How do you secure APIs as an OAuth2 Resource Server (JWT bearer tokens)?',
answerMd: `
### OAuth2 Resource Server

- Add \`spring-boot-starter-oauth2-resource-server\`.
- Configure issuer URI or JWK set URI.
- Enable JWT support in your filter chain.

\`\`\`java
http
.authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
.oauth2ResourceServer(oauth2 -> oauth2.jwt());
\`\`\`

Spring will validate incoming Bearer tokens against the configured JWK set.
`
},
{
question: 'When and how should I enable or disable CSRF protection?',
answerMd: `
### CSRF Protection

- Enabled by default to guard state-changing requests in web apps.
- For stateless REST APIs (JWT or Basic), you typically disable it.

\`\`\`java
http
.csrf(csrf -> csrf.disable());
\`\`\`

If you keep it on, ensure your forms or XHR clients include the CSRF token on each POST/PUT/DELETE.
`
},
{
question: 'How can I enforce method-level security with annotations?',
answerMd: `
### Method Security

1. Add \`@EnableMethodSecurity\` (or \`@EnableGlobalMethodSecurity\`).
2. Annotate service methods with \`@PreAuthorize\`, \`@PostAuthorize\`, or \`@Secured\`.

\`\`\`java
@PreAuthorize("hasRole('ADMIN')")
public void deleteUser(Long id) { … }

@Secured("ROLE_USER")
public void viewProfile() { … }
\`\`\`

Spring evaluates expressions against the current \`Authentication\` in \`SecurityContextHolder\`.
`
},
{
question: 'How do you configure CORS in Spring Security to allow cross-origin requests?',
answerMd: `
### CORS Configuration

- Define a \`CorsConfigurationSource\` bean with allowed origins & methods.
- Enable it in your security chain with \`.cors()\`.

\`\`\`java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
var config = new CorsConfiguration();
config.setAllowedOrigins(List.of("http://localhost:3000"));
config.setAllowedMethods(List.of("GET","POST","PUT","DELETE"));
var source = new UrlBasedCorsConfigurationSource();
source.registerCorsConfiguration("/**", config);
return source;
}

http.cors();
\`\`\`
`
}
]
},// Add this card to your src/qa-data.ts

{
category: 'springBoot',
title: 'Spring Bean & Context Lifecycle: Use Cases & Examples',
subItems: [
{
question: 'What are the main phases in a Spring bean’s lifecycle?',
answerMd: `
Spring manages each bean through these phases:

1. Instantiation
2. Populate properties (DI)
3. Aware callbacks (\`BeanNameAware\`, \`BeanFactoryAware\`)
4. \`BeanPostProcessor.postProcessBeforeInitialization\`
5. Initialization
- \`@PostConstruct\`
- \`InitializingBean.afterPropertiesSet()\`
- Custom \`init-method\`
6. \`BeanPostProcessor.postProcessAfterInitialization\`
7. Usage by application
8. Destruction
- \`@PreDestroy\`
- \`DisposableBean.destroy()\`
- Custom \`destroy-method\`

Understanding these phases helps you hook into exactly the right moment to configure, validate, or tear down resources.
`
},
{
question: 'How do you add custom initialization logic to a bean?',
answerMd: `
You can run setup code right after Spring injects dependencies:

1. \`@PostConstruct\` on a method
2. Implement \`InitializingBean.afterPropertiesSet()\`
3. Specify a custom \`init-method\` in XML or \`@Bean(initMethod="…")\`

Example using \`@PostConstruct\`:
\`\`\`java
@Component
public class CacheLoader {
private Map<String,Data> cache;

@PostConstruct
public void loadCache() {
// populate heavy in-memory cache from DB
    this.cache = someRepo.findAll().stream()
.collect(toMap(Data::getKey, identity()));
}
}
\`\`\`
This ensures your cache is ready before any other bean uses it.
`
},
{
question: 'How do you perform cleanup when a bean is destroyed?',
answerMd: `
Release resources right before the container removes the bean:

1. \`@PreDestroy\` on a method
2. Implement \`DisposableBean.destroy()\`
3. Specify a custom \`destroy-method\`

Example releasing a file handle:
\`\`\`java
@Component
public class FileProcessor {
private BufferedWriter writer = new BufferedWriter(new FileWriter("out.log"));

@PreDestroy
public void closeWriter() throws IOException {
writer.flush();
writer.close();
}
}
\`\`\`
This guarantees log output is flushed and the file handle is closed.
`
},
{
question: 'What can you do with BeanPostProcessor before and after initialization?',
answerMd: `
\`BeanPostProcessor\` lets you intercept every bean:

- postProcessBeforeInitialization: modify fields, wrap proxies
- postProcessAfterInitialization: wrap with AOP, add metrics

Use case—timing method calls:
\`\`\`java
@Component
public class TimingPostProcessor implements BeanPostProcessor {
@Override
public Object postProcessAfterInitialization(Object bean, String name) {
if (bean instanceof Service) {
return Proxy.newProxyInstance(
bean.getClass().getClassLoader(),
bean.getClass().getInterfaces(),
(proxy, method, args) -> {
long start = System.nanoTime();
Object result = method.invoke(bean, args);
log.info("{} took {} ns", method, System.nanoTime() - start);
return result;
});
}
return bean;
}
}
\`\`\`
This wraps all \`Service\` beans to log execution time.
`
},
{
question: 'How can you listen to ApplicationContext lifecycle events?',
answerMd: `
Spring publishes events at context startup and shutdown:

- \`ContextRefreshedEvent\` (after \`.refresh()\`)
- \`ContextStartedEvent\`, \`ContextStoppedEvent\`
- \`ContextClosedEvent\`

Example listener:
\`\`\`java
@Component
public class StartupListener implements ApplicationListener<ContextRefreshedEvent> {
@Override
public void onApplicationEvent(ContextRefreshedEvent ev) {
System.out.println("Context initialized, can start background jobs");
}
}
\`\`\`
Use these to trigger tasks only after all beans are ready.
`
},
{
question: 'What is lazy initialization and when should you use it?',
answerMd: `
By default, singleton beans are created on context startup. With \`@Lazy\`, Spring delays instantiation until first request.

Use cases:
- Heavy beans you rarely use
- Conditional components in large application contexts

Example:
\`\`\`java
@Configuration
public class ReportingConfig {
@Bean
@Lazy
public ReportService reportService() {
return new ReportService(); // expensive setup
  }
}
\`\`\`
This speeds up startup and only builds \`ReportService\` if a controller or service actually needs it.
`
},
{
question: 'How does destruction differ for prototype-scoped beans?',
answerMd: `
Prototype beans skip Spring-managed destroy callbacks. You get a fresh instance each lookup, but:

- \`@PreDestroy\`, \`DisposableBean\` and \`destroy-method\` are not called.
- You must clean up prototypes manually.

Example manual cleanup:
\`\`\`java
ReportGenerator gen = ctx.getBean(ReportGenerator.class);
// use gen...
gen.close(); // your custom cleanup
\`\`\`
Remember: prototype = your responsibility for full lifecycle.
`
}
]
},// src/qa-data.ts
{
category: 'kafka',
title: 'Apache Kafka: Common Code‐Level Questions',
subItems: [
{
question: 'What is Apache Kafka and how do you send messages with the Java Producer API?',
answerMd: `
### Explanation

Apache Kafka is a distributed event streaming platform. Producers publish records to named **topics**, which are partitioned for scalability.

---

### Code

\`\`\`java
import org.apache.kafka.clients.producer.*;
import java.util.Properties;

public class SimpleProducer {
public static void main(String[] args) {
Properties props = new Properties();
props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");
props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");

try (KafkaProducer<String, String> producer = new KafkaProducer<>(props)) {
for (int i = 0; i < 5; i++) {
ProducerRecord<String, String> record =
new ProducerRecord<>("my-topic", "key" + i, "message-" + i);
producer.send(record, (metadata, exception) -> {
if (exception != null) {
exception.printStackTrace();
} else {
System.out.printf(
"Sent to topic=%s partition=%d offset=%d%n",
metadata.topic(), metadata.partition(), metadata.offset());
}
});
}
}
}
}
\`\`\`

---

### Key Points

- \`BOOTSTRAP_SERVERS_CONFIG\`: Kafka brokers’ addresses
- \`ProducerRecord\`: encapsulates topic, key, and value
- Callback gives you partition and offset info
`
},
{
question: 'How do you configure and implement a Kafka consumer in Java?',
answerMd: `
### Explanation

Consumers subscribe to topics, pull records, and manage offsets. They belong to a **consumer group** for parallelism and fault tolerance.

---

### Code

\`\`\`java
import org.apache.kafka.clients.consumer.*;
import org.apache.kafka.common.serialization.StringDeserializer;
import java.time.Duration;
import java.util.*;

public class SimpleConsumer {
public static void main(String[] args) {
Properties props = new Properties();
props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
props.put(ConsumerConfig.GROUP_ID_CONFIG, "my-group");
props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "false");

try (KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props)) {
consumer.subscribe(Collections.singletonList("my-topic"));
while (true) {
ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
for (ConsumerRecord<String, String> rec : records) {
System.out.printf("Received key=%s value=%s offset=%d partition=%d%n",
rec.key(), rec.value(), rec.offset(), rec.partition());
}
consumer.commitSync();
}
}
}
}
\`\`\`

---

### Key Points

- \`group.id\`: identifies consumer group
- \`subscribe\` vs \`assign\`: dynamic rebalancing vs fixed partitions
- \`auto.offset.reset\`: where to start if no committed offset
- Manual vs auto offset commit
`
},
{
question: 'How do you serialize and deserialize custom objects in Kafka?',
answerMd: `
### Explanation

Kafka uses serializers and deserializers (SerDes) to convert objects to/from byte arrays. For custom types, implement \`Serializer<T>\` and \`Deserializer<T>\`.

---

### Code

\`\`\`java
// 1. Define your POJO
public class User {
public String id;
public String name;
// constructors, getters/setters omitted
}

// 2. JSON SerDe using Jackson
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.common.serialization.*;

public class JsonSerializer<T> implements Serializer<T> {
private final ObjectMapper mapper = new ObjectMapper();
@Override
public byte[] serialize(String topic, T data) {
try {
return mapper.writeValueAsBytes(data);
} catch (Exception e) {
throw new SerializationException(e);
}
}
}

public class JsonDeserializer<T> implements Deserializer<T> {
private final ObjectMapper mapper = new ObjectMapper();
private Class<T> cls;
public JsonDeserializer(Class<T> cls) { this.cls = cls; }
@Override
public T deserialize(String topic, byte[] bytes) {
try {
return mapper.readValue(bytes, cls);
} catch (Exception e) {
throw new SerializationException(e);
}
}
}

// 3. Configure producer/consumer
props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class.getName());
props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class.getName());
props.put("json.deserializer.class", User.class.getName());
\`\`\`

---

### Key Points

- Always match key and value SerDe on both producer and consumer
- Can use Avro, Protobuf SerDes for schema evolution
`
},
{
question: 'What is a consumer group and how does offset management work?',
answerMd: `
### Explanation

- **Consumer Group**
- A set of consumers sharing the same \`group.id\`
- Partitions are evenly assigned across the group
- Provides horizontal scalability and fault tolerance

- **Offset Management**
- Each consumer tracks its position (offset) per partition
- Offsets committed to Kafka’s \`__consumer_offsets\` topic
- On restart, consumer resumes from last committed offset

---

### Code Snippet

\`\`\`java
// Auto commit:
props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "true");
props.put(ConsumerConfig.AUTO_COMMIT_INTERVAL_MS_CONFIG, "1000");

// Manual commit:
consumer.commitSync();   // synchronous
consumer.commitAsync();  // asynchronous
\`\`\`

---

### Key Points

- Use manual commit for at-least-once processing semantics
- RocksDB-backed offsets in Kafka Streams
`
},
{
question: 'How do you achieve exactly-once semantics (EOS) in Kafka Producers and Streams?',
answerMd: `
### Explanation

Exactly-once delivery means each message is processed and stored once, even in failures. Kafka supports EOS at producer and Streams layers.

---

### Producer with Transactions

\`\`\`java
props.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, "true");
props.put(ProducerConfig.TRANSACTIONAL_ID_CONFIG, "txn-01");

KafkaProducer<String, String> producer = new KafkaProducer<>(props);
producer.initTransactions();

try {
producer.beginTransaction();
producer.send(new ProducerRecord<>("topicA", "k", "v1"));
producer.send(new ProducerRecord<>("topicB", "k", "v2"));
producer.commitTransaction();
} catch (Exception e) {
producer.abortTransaction();
}
\`\`\`

---

### Kafka Streams

\`\`\`java
StreamsBuilder builder = new StreamsBuilder();
builder.stream("input-topic")
.mapValues(v -> v.toUpperCase())
.to("output-topic");

Properties props = new Properties();
props.put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, StreamsConfig.EXACTLY_ONCE_V2);

KafkaStreams streams = new KafkaStreams(builder.build(), props);
streams.start();
\`\`\`

---

### Key Points

- Idempotence prevents duplicates on retry
- Transactions group multi-topic writes
- \`EXACTLY_ONCE_V2\` is the recommended Streams setting
`
},
{
question: 'How do you programmatically create topics with the AdminClient?',
answerMd: `
### Explanation

Kafka’s \`AdminClient\` API lets you manage topics and broker configuration.

---

### Code

\`\`\`java
import org.apache.kafka.clients.admin.*;
import java.util.*;

public class TopicCreator {
public static void main(String[] args) throws Exception {
Properties props = Map.of(
AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092"
);
try (AdminClient admin = AdminClient.create(props)) {
NewTopic topic = new NewTopic("new-topic", 3, (short)1);
CreateTopicsResult result = admin.createTopics(Collections.singleton(topic));
result.all().get();  // wait for creation
      System.out.println("Topic created");
}
}
}
\`\`\`

---

### Key Points

- Specify partitions and replication factor
- Check for \`TopicExistsException\` before creating
`
},
{
question: 'How do you use the Kafka Streams API for real-time processing?',
answerMd: `
### Explanation

Kafka Streams is a client library for processing and transforming data in Kafka topics.

---

### Code

\`\`\`java
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.*;
import org.apache.kafka.streams.kstream.*;
import java.util.Properties;

public class WordCountStream {
public static void main(String[] args) {
StreamsBuilder builder = new StreamsBuilder();
KStream<String, String> textLines = builder.stream("text-input");

KTable<String, Long> wordCounts = textLines
.flatMapValues(line -> List.of(line.toLowerCase().split("\\W+")))
.groupBy((key, word) -> word)
.count(Materialized.as("Counts"));

wordCounts.toStream().to("word-count-output", Produced.with(Serdes.String(), Serdes.Long()));

Properties props = new Properties();
props.put(StreamsConfig.APPLICATION_ID_CONFIG, "wordcount-app");
props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
props.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass());
props.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass());

KafkaStreams streams = new KafkaStreams(builder.build(), props);
streams.start();
}
}
\`\`\`

---

### Key Points

- DSL vs Processor API
- Stateful operations: joins, windows, aggregations
- Interactive queries on state stores
`
},
{
question: 'How do you handle retries, back-off, and dead-letter queues in Kafka consumers?',
answerMd: `
### Explanation

When a consumer fails to process a record, you can retry processing or route the record to a Dead-Letter Queue (DLQ) topic. This prevents poisoning the main pipeline.

---

### Code

\`\`\`java
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.producer.*;

public class RetryableConsumer {
private static final String DLQ_TOPIC = "my-topic-DLQ";

public static void processRecord(ConsumerRecord<String, String> rec,
KafkaProducer<String, String> dlqProducer) {
int attempts = 0, maxRetries = 3;
while (attempts++ < maxRetries) {
try {
if (rec.value().contains("BAD")) {
throw new RuntimeException("Bad data encountered");
}
System.out.println("Processed: " + rec.value());
return;
} catch (Exception e) {
System.err.printf("Attempt %d failed for offset %d%n", attempts, rec.offset());
try { Thread.sleep(1000 * attempts); } catch (InterruptedException ignored) {}
}
}
ProducerRecord<String, String> dlqRec =
new ProducerRecord<>(DLQ_TOPIC, rec.key(), rec.value());
dlqProducer.send(dlqRec, (m, ex) -> {
if (ex != null) ex.printStackTrace();
else System.out.println("Routed to DLQ: " + m.offset());
});
}
}
\`\`\`

---

### Key Points

- Exponential back-off to avoid tight retry loops
- After \`maxRetries\`, produce to a DLQ topic
- Keep a separate producer instance for DLQ routing
`
},
{
question: 'How do you implement a custom partitioner in Kafka Producer?',
answerMd: `
### Explanation

A custom partitioner lets you control which partition each message lands in, based on your own logic.

---

### Code

\`\`\`java
import org.apache.kafka.clients.producer.Partitioner;
import org.apache.kafka.common.Cluster;
import java.util.Map;

public class EvenOddPartitioner implements Partitioner {
@Override
public void configure(Map<String, ?> configs) { }

@Override
public int partition(String topic, Object keyObj, byte[] keyBytes,
Object value, byte[] valueBytes, Cluster cluster) {
String key = (String) keyObj;
int numPartitions = cluster.partitionsForTopic(topic).size();
int bucket = Integer.parseInt(key) % 2;
return bucket % numPartitions;
}

@Override
public void close() { }
}
\`\`\`

\`\`\`java
// Configure your producer
Properties props = new Properties();
props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");
props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");
props.put(ProducerConfig.PARTITIONER_CLASS_CONFIG, EvenOddPartitioner.class.getName());
\`\`\`

---

### Key Points

- \`partition()\` gets access to topic metadata
- Always mod by \`numPartitions\` to avoid out-of-range errors
- Partitioner must be stateless or thread-safe
`
},
{
question: 'How do you integrate Kafka with Schema Registry using Avro?',
answerMd: `
### Explanation

Using Confluent’s Schema Registry with Avro ensures producers and consumers agree on your data schema and evolve safely.

---

### Code

\`\`\`java
Properties props = new Properties();
props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
props.put("schema.registry.url", "http://localhost:8081");
props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, "io.confluent.kafka.serializers.KafkaAvroSerializer");
props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, "io.confluent.kafka.serializers.KafkaAvroSerializer");

KafkaProducer<String, GenericRecord> producer = new KafkaProducer<>(props);

// build an Avro record
Schema schema = new Schema.Parser().parse(new File("user.avsc"));
GenericRecord user = new GenericData.Record(schema);
user.put("id", 123);
user.put("name", "Alice");

ProducerRecord<String, GenericRecord> record =
new ProducerRecord<>("avro-topic", "user-123", user);
producer.send(record).get();
\`\`\`

---

### Key Points

- Use \`KafkaAvroSerializer\` and \`KafkaAvroDeserializer\` on both ends
- \`schema.registry.url\` points to your Schema Registry service
- Avro schemas evolve via backwards/forwards compatibility rules
`
},
{
question: 'How do you programmatically manage Kafka Connect connectors via REST API?',
answerMd: `
### Explanation

Kafka Connect exposes a REST interface for creating, pausing, resuming, and deleting connectors.

---

### Code

\`\`\`java
import java.net.http.*;
import java.net.URI;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;

public class ConnectManager {
private static final HttpClient client = HttpClient.newHttpClient();
private static final ObjectMapper mapper = new ObjectMapper();
private static final String CONNECT_URL = "http://localhost:8083/connectors";

public static void createConnector(String name, Map<String,Object> config) throws Exception {
Map<String,Object> body = Map.of(
"name", name,
"config", config
);
String json = mapper.writeValueAsString(body);
HttpRequest req = HttpRequest.newBuilder()
.uri(URI.create(CONNECT_URL))
.header("Content-Type", "application/json")
.POST(HttpRequest.BodyPublishers.ofString(json))
.build();
HttpResponse<String> resp = client.send(req, HttpResponse.BodyHandlers.ofString());
System.out.println("Response: " + resp.statusCode() + " " + resp.body());
}
}
\`\`\`

---

### Key Points

- Connect REST API runs on port 8083 by default
- Provide full \`config\` map including \`connector.class\` and connector-specific props
- Use GET/\`/{name}\` to fetch status, DELETE to remove connectors
`
},
{
question: 'How do you monitor Kafka broker and client metrics via JMX in Java?',
answerMd: `
### Explanation

Kafka exposes hundreds of metrics through JMX MBeans. You can connect to the broker’s JMX port or fetch client-side metrics.

---

### Code

\`\`\`java
import javax.management.*;
import javax.management.remote.*;
import java.util.Set;

public class JmxMetricsReader {
public static void main(String[] args) throws Exception {
JMXServiceURL url =
new JMXServiceURL("service:jmx:rmi:///jndi/rmi://localhost:9999/jmxrmi");
JMXConnector jmxc = JMXConnectorFactory.connect(url);
MBeanServerConnection mbsc = jmxc.getMBeanServerConnection();

ObjectName name = new ObjectName("kafka.server:type=BrokerTopicMetrics,name=MessagesInPerSec");
Object attr = mbsc.getAttribute(name, "OneMinuteRate");
System.out.println("MessagesInPerSec (1m rate): " + attr);

jmxc.close();
}
}
\`\`\`

---

### Key Points

- Broker JMX port configured via \`KAFKA_JMX_OPTS\` env var
- Query any MBean with pattern \`kafka.*\` or client-side metrics under \`kafka.producer\`
- Useful for custom dashboards or alerts
`
}
]
},// Add this as the AWS Lambda card in your src/qa-data.ts

{
category: 'aws',
title: 'AWS Lambda Functions',
subItems: [
{
question: 'What is AWS Lambda and when should you use it?',
answerMd: `
### What Is AWS Lambda?

\`\`\`mermaid
flowchart LR
ES[Event Source] --> L[Lambda Function]
L --> C[Container Init]
C --> H[Handler Execution]
H --> R[Return Response]
\`\`\`

AWS Lambda is a serverless compute service that runs your code in response to events without provisioning servers. It automatically scales based on the volume of events.

\`\`\`js
// Example: simple Node.js handler
exports.handler = async (event) => {
console.log("Received event:", JSON.stringify(event));
return { statusCode: 200, body: "Hello from Lambda!" };
};
\`\`\`
`
},
{
question: 'How does AWS Lambda pricing work?',
answerMd: `
### Lambda Pricing Model

\`\`\`mermaid
pie
title Cost Components
"Requests" : 20
"Compute Duration (GB-s)" : 80
\`\`\`

1. **Request Charges**
\$0.20 per 1M requests (after free tier).

2. **Compute Duration**
Billed in GB-seconds:
\`Cost = Memory(GB) × Duration(s) × \$0.0000166667\`

3. **Free Tier**
1M free requests + 400 000 GB-s per month.

\`\`\`math
Cost = Requests × \$0.0000002 + (Memory_{GB} × Duration_{s} × 0.0000166667)
\`\`\`
`
},
{
question: 'What event sources can trigger a Lambda function?',
answerMd: `
### Supported Event Sources

\`\`\`mermaid
flowchart TB
subgraph Push Sources
APIG[API Gateway]
SNS[SNS Topic]
S3[S3 Object Event]
EB[EventBridge]
end
subgraph Pull Sources
SQS[SQS Queue]
KDS[Kinesis Stream]
DBS[DynamoDB Stream]
end
APIG & SNS & S3 & EB --> L[Lambda]
SQS & KDS & DBS --> L
\`\`\`

You can also invoke Lambda directly via SDK, CLI, or Function URLs.
`
},
{
question: 'How do you package and deploy a Lambda function?',
answerMd: `
### Packaging & Deployment

\`\`\`mermaid
sequenceDiagram
participant Dev as Developer
participant ZIP as ZIP Archive
participant S3 as S3 (opt)
participant AWS as AWS Lambda
Dev->>ZIP: zip code & deps
ZIP->>S3: upload to S3       %% optional
Dev->>AWS: update-function-code
AWS-->>Dev: confirmation
\`\`\`

**ZIP Deployment (CLI)**
\`\`\`bash
zip -r function.zip index.js node_modules/
aws lambda update-function-code \
--function-name MyFunc \
--zip-file fileb://function.zip
\`\`\`

**Container Image Deployment**
\`\`\`bash
docker build -t repo/myfunc:latest .
docker push repo/myfunc:latest
aws lambda update-function-code \
--function-name MyFunc \
--image-uri repo/myfunc:latest
\`\`\`
`
},
{
question: 'What are cold starts in Lambda and how can you mitigate them?',
answerMd: `
### Cold Start Lifecycle

\`\`\`mermaid
stateDiagram-v2
[*] --> ColdInit
ColdInit --> HandlerInit
HandlerInit --> Running
Running --> [*]
\`\`\`

A cold start happens when AWS provisions a new container. To mitigate:

- **Provisioned Concurrency**
Keep pre-initialized containers warm.
- **Smaller Packages**
Exclude unused dependencies; use Lambda Layers.
- **Lazy Init**
Move heavy code into the handler instead of global scope.
`
},
{
question: 'How do Lambda Versions and Aliases work?',
answerMd: `
### Versions & Aliases Flow

\`\`\`mermaid
flowchart LR
Dev[Developer] --> |PublishVersion| V1[v1]
Dev --> |PublishVersion| V2[v2]
AliasProd[Alias: “prod”] --> V1
AliasDev[Alias: “dev”] --> V2
\`\`\`

- **Versions** are immutable snapshots of code + config.
- **Aliases** point to versions and support weighted traffic for blue/green shifts.

\`\`\`bash
# Publish a new version
aws lambda publish-version --function-name MyFunc
# Update alias to new version
aws lambda update-alias \
--function-name MyFunc \
--name prod \
--function-version 2
\`\`\`
`
},
{
question: 'What are Lambda Layers and how do you use them?',
answerMd: `
### Layer Packaging

\`\`\`mermaid
classDiagram
class Function {
+handler()
+layers[]
}
class Layer {
-nodejs/
-python/
}
Function <|.. Layer
\`\`\`

**Create & Publish**
\`\`\`bash
zip -r layer.zip nodejs/
aws lambda publish-layer-version \
--layer-name SharedLibs \
--zip-file fileb://layer.zip \
  --compatible-runtimes nodejs14.x
\`\`\`

**Attach to Function**
\`\`\`bash
aws lambda update-function-configuration \
--function-name MyFunc \
--layers arn:aws:lambda:us-east-1:123456789012:layer:SharedLibs:1
\`\`\`
`
},
{
question: 'How do you configure environment variables and timeouts?',
answerMd: `
### Configuration Settings

\`\`\`mermaid
flowchart LR
UI[Console/CLI] --> CFG[Function Config]
CFG --> Env[Environment Variables]
CFG --> Timeout[Timeout (s)]
\`\`\`

Configure via AWS CLI:

\`\`\`bash
aws lambda update-function-configuration \
--function-name MyFunc \
--environment Variables="{STAGE=prod,LOG_LEVEL=info}" \
--timeout 30
\`\`\`

- **Environment Variables** are available in \`process.env\` (Node.js) or \`os.environ\` (Python).
- **Timeout** max is 900 seconds (15 minutes).
`
}
]
},// Add these cards after your AWS Lambda card in src/qa-data.ts

{
category: 'aws',
title: 'AWS Core Services: Networking & Security',
subItems: [
{
question: 'What is an AWS VPC and how is it structured?',
answerMd: `
### AWS VPC Overview

\`\`\`mermaid
flowchart TB
VPC[VPC: 10.0.0.0/16]
subgraph Public
IGW[Internet Gateway]
RT-Pub[Route Table (0.0.0.0/0 → IGW)]
Subnet-Pub1[Subnet A (10.0.1.0/24)]
Subnet-Pub2[Subnet B (10.0.2.0/24)]
end
subgraph Private
NAT[NAT Gateway]
RT-Priv[Route Table (0.0.0.0/0 → NAT)]
Subnet-Priv1[Subnet C (10.0.3.0/24)]
Subnet-Priv2[Subnet D (10.0.4.0/24)]
end
VPC --> Public
VPC --> Private
Subnet-Pub1 --> RT-Pub
Subnet-Pub2 --> RT-Pub
Subnet-Priv1 --> RT-Priv
Subnet-Priv2 --> RT-Priv
RT-Pub --> IGW
RT-Priv --> NAT
\`\`\`

- A VPC is your isolated network container.
- Public subnets route directly to an Internet Gateway (IGW).
- Private subnets route outbound via a NAT Gateway.
- Security Groups (instance-level) and Network ACLs (subnet-level) control traffic.

\`\`\`bash
# CLI: create VPC, subnets, IGW, route tables
VPC_ID=$(aws ec2 create-vpc --cidr-block 10.0.0.0/16 --query 'Vpc.VpcId' --output text)
aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.1.0/24
aws ec2 create-internet-gateway
aws ec2 attach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id igw-123456
aws ec2 create-route-table --vpc-id $VPC_ID
\`\`\`
`
},
{
question: 'How do IAM users, roles, and policies work together?',
answerMd: `
### IAM Entities & Trust

\`\`\`mermaid
flowchart LR
User[User] --uses--> Policy{Inline & Managed Policies}
Role[Role] --assume--> Policy
Role --trusted by--> Service[EC2 / Lambda / STS]
User & Role --grant permissions--> AWS_Resources
\`\`\`

- **Users**: long-term credentials (console/API).
- **Roles**: assumable identities for services or federated users.
- **Policies**: JSON documents that allow or deny actions on resources.

\`\`\`json
// Example IAM policy granting S3 read-only
{
"Version": "2012-10-17",
"Statement": [{
"Effect": "Allow",
"Action": ["s3:GetObject", "s3:ListBucket"],
"Resource": ["arn:aws:s3:::my-bucket", "arn:aws:s3:::my-bucket/*"]
}]
}
\`\`\`
`
}
]
},

{
category: 'aws',
title: 'AWS Messaging Services: SQS & SNS',
subItems: [
{
question: 'How does Amazon SQS work and when should you use it?',
answerMd: `
### Amazon SQS Architecture

\`\`\`mermaid
sequenceDiagram
Producer->>SQS: SendMessage
Note right of SQS: Messages stored durably
Consumer->>SQS: ReceiveMessage / DeleteMessage
\`\`\`

- **Standard Queues**: at-least-once delivery, best-effort ordering.
- **FIFO Queues**: exactly-once processing, strict ordering.
- **Dead-Letter Queues**: isolate messages that exceed max retries.

\`\`\`js
// Node.js v3 example: send & receive
import { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";
const client = new SQSClient({ region: "us-east-1" });
await client.send(new SendMessageCommand({ QueueUrl, MessageBody: "Hello" }));
const msgs = await client.send(new ReceiveMessageCommand({ QueueUrl, MaxNumberOfMessages: 1 }));
if (msgs.Messages) {
await client.send(new DeleteMessageCommand({ QueueUrl, ReceiptHandle: msgs.Messages[0].ReceiptHandle! }));
}
\`\`\`
`
},
{
question: 'How does Amazon SNS work and when should you use it?',
answerMd: `
### Amazon SNS Fan-out

\`\`\`mermaid
flowchart TB
Publisher -->|Publish| SNS[Topic]
SNS -->|HTTP| Endpoint1[HTTP/S Endpoint]
SNS -->|Email| Endpoint2[Email]
SNS -->|SQS| Endpoint3[Queue]
\`\`\`

- **Topics** broadcast notifications to multiple subscribers.
- Supports HTTP/S, email, SMS, SQS, Lambda endpoints.
- Use SNS for push-based, real-time fan-out.

\`\`\`js
// Node.js v3: publish a message
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
const sns = new SNSClient({ region: "us-east-1" });
await sns.send(new PublishCommand({ TopicArn, Message: "Alert: job completed" }));
\`\`\`
`
}
]
},

{
category: 'aws',
title: 'AWS ETL & Analytics: Glue',
subItems: [
{
question: 'What is AWS Glue and what components does it have?',
answerMd: `
### AWS Glue Components

\`\`\`mermaid
flowchart LR
S3_Raw[S3 Raw Data] --> Crawler[Crawler] --> DataCatalog[Data Catalog]
DataCatalog --> Job[Glue ETL Job] --> S3_Cleaned[S3 Cleaned Data]
Job -->|Logs| CloudWatch[CloudWatch Logs]
\`\`\`

- **Glue Data Catalog**: unified metadata repository.
- **Crawlers**: infer schemas and populate the catalog.
- **ETL Jobs**: Spark-based scripts (Python/Scala) transform data.
- **Triggers**: schedule or event-driven job runs.

`
},
{
question: 'How do you author and run an AWS Glue job?',
answerMd: `
### Glue Job Example (Python)

\`\`\`python
import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from awsglue.context import GlueContext
from pyspark.context import SparkContext

args = getResolvedOptions(sys.argv, ["JOB_NAME"])
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session

# Read from catalog
datasource = glueContext.create_dynamic_frame.from_catalog(
database="raw_db", table_name="events"
)

# Transform
mapped = ApplyMapping.apply(
frame=datasource,
mappings=[("userId", "string", "user_id", "string"),
("timestamp", "long", "ts", "timestamp")]
)

# Write back to S3 in Parquet
glueContext.write_dynamic_frame.from_options(
frame=mapped,
connection_type="s3",
connection_options={"path": "s3://cleaned-bucket/"},
format="parquet"
)

job.commit()
\`\`\`

**CLI to start job**
\`\`\`bash
aws glue start-job-run --job-name my-glue-job
\`\`\`
`
}
]
},
{
category: 'react',
title: 'Banking Finance App React',
subItems: [
{
question: 'How do I build a “Banking Finance App” React app from scratch covering every core React concept, using an Indian storytelling format?',
answerMd: `
### The Banking Finance App: An Indian Tale

In the thriving city of DhanPur, young banker Arjun dreamed of a digital “Banking Finance App” to serve villagers and merchants alike. Let’s journey with him through each lane of React as he builds accounts, transactions, and loan calculators.

---

#### 1. Opening the Bank (create-react-app)
Arjun summons the village builder:

\`\`\`bash
npx create-react-app banking-hub
cd banking-hub
npm start
\`\`\`

This lays the foundation (\`public/index.html\`) and the main gate (\`src/index.js\`).

---

#### 2. Account Window: Functional Components
Each customer’s account is a component:

\`\`\`jsx
// src/components/AccountCard.jsx
import React from 'react';

function AccountCard({ name, balance }) {
return (
<div className="account-card">
<h3>{name}</h3>
<p>Balance: ₹{balance}</p>
</div>
);
}

export default AccountCard;
\`\`\`

Props (\`name\`, \`balance\`) are the customer’s details.

---

#### 3. Counting Deposits: useState
The teller tracks daily deposits:

\`\`\`jsx
import React, { useState } from 'react';

function DepositCounter() {
const [deposits, setDeposits] = useState(0);
return (
<div>
<p>Deposits today: {deposits}</p>
<button onClick={() => setDeposits(d => d + 1)}>
New Deposit
</button>
</div>
);
}
\`\`\`

\`useState\` is the teller’s tally sheet.

---

#### 4. Fetching Transactions: useEffect
Every dawn, transactions arrive from the central server:

\`\`\`jsx
import React, { useState, useEffect } from 'react';

function TransactionsList() {
const [txns, setTxns] = useState([]);

useEffect(() => {
fetch('/api/transactions')
.then(r => r.json())
.then(setTxns);
}, []); // run only once each morning

  return (
<ul>
{txns.map(t => (
<li key={t.id}>{t.date}: ₹{t.amount}</li>
))}
</ul>
);
}
\`\`\`

\`useEffect\` simulates the postman delivering records.

---

#### 5. A Custom Ritual: useFetch Hook
To reuse any data fetch:

\`\`\`jsx
// src/hooks/useFetch.js
import { useState, useEffect } from 'react';

export function useFetch(url) {
const [data, setData] = useState(null);
useEffect(() => {
fetch(url).then(r => r.json()).then(setData);
}, [url]);
return data;
}
\`\`\`

Call \`const accounts = useFetch('/api/accounts')\` anywhere.

---

#### 6. The Bank Vault: Context API
Share authentication and user info:

\`\`\`jsx
// src/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
const [user, setUser] = useState(null);
return (
<AuthContext.Provider value={{ user, setUser }}>
{children}
</AuthContext.Provider>
);
}

export function useAuth() {
return useContext(AuthContext);
}
\`\`\`

Wrap in \`src/index.js\`:
\`<AuthProvider><App/></AuthProvider>\`.

---

#### 7. Balancing the Books: useReducer
A complex ledger demands a reducer:

\`\`\`js
// src/ledgerReducer.js
export function ledgerReducer(state, action) {
switch (action.type) {
case 'ADD_TXN':    return [...state, action.txn];
case 'REMOVE_TXN': return state.filter(t => t.id !== action.id);
default:           return state;
}
}
\`\`\`

Use \`useReducer(ledgerReducer, [])\` to manage transactions.

---

#### 8. Loading Spinner: Higher-Order Component
Wrap modules with a spinner:

\`\`\`jsx
function withSpinner(Component) {
return function Wrapped({ isLoading, ...props }) {
return isLoading
? <p>Loading…</p>
: <Component {...props} />;
};
}
\`\`\`

Use: \`const TxnWithSpinner = withSpinner(TransactionsList);\`

---

#### 9. Flexible Calculations: Render Props
A dynamic loan calculator:

\`\`\`jsx
function LoanCalculator({ render }) {
const rate = 0.08;
return <div>{render(rate)}</div>;
}

// Usage:
<LoanCalculator render={r => (
<p>EMI for ₹10000 at {r*100}%: ₹{(10000*r)/(1-Math.pow(1+r, -12)).toFixed(2)}</p>
)} />
\`\`\`

---

#### 10. Vault Tabs: Compound Components
Build “Accounts” / “Transactions” tabs sharing the activeTab context.

---

#### 11. Safety Net: Error Boundaries

\`\`\`jsx
class TransactionErrorBoundary extends React.Component {
state = { hasError: false };
static getDerivedStateFromError() { return { hasError: true }; }
componentDidCatch(err) { console.error(err); }
render() {
return this.state.hasError
? <p>Failed to load transactions.</p>
: this.props.children;
}
}
\`\`\`

Wrap:
\`<TransactionErrorBoundary><TransactionsList/></TransactionErrorBoundary>\`.

---

#### 12. Secret Safe: Code Splitting

\`\`\`jsx
const Accounts     = React.lazy(() => import('./Accounts'));
const Transactions = React.lazy(() => import('./Transactions'));

function App() {
return (
<Suspense fallback={<p>Loading module…</p>}>
<Accounts />
<Transactions />
</Suspense>
);
}
\`\`\`

---

#### 13. Walking the Ledger: React Router

\`\`\`bash
npm install react-router-dom
\`\`\`

\`\`\`jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
return (
<BrowserRouter>
<nav>
<Link to="/">Dashboard</Link>
<Link to="/accounts">Accounts</Link>
<Link to="/transactions">Transactions</Link>
</nav>
<Routes>
<Route path="/"               element={<Dashboard />} />
<Route path="/accounts"       element={<Accounts />} />
<Route path="/transactions"   element={<Transactions />} />
</Routes>
</BrowserRouter>
);
}
\`\`\`

---

#### 14. Performance Tuning: useMemo & useCallback

\`\`\`jsx
const highValueTxns = useMemo(
() => txns.filter(t => t.amount > 10000),
[txns]
);
const handleAddTxn = useCallback(
txn => dispatch({ type: 'ADD_TXN', txn }),
[]
);
\`\`\`

---

#### 15. The Grand Ledger: Bringing It All Together

\`\`\`jsx
// src/App.jsx
import React, { lazy, Suspense } from 'react';
import { useAuth } from './AuthContext';
import TransactionErrorBoundary from './TransactionErrorBoundary';

const Dashboard    = lazy(() => import('./Dashboard'));
const Accounts     = lazy(() => import('./Accounts'));
const Transactions = lazy(() => import('./Transactions'));

function App() {
const { user } = useAuth();
return (
<div>
<h1>Welcome to Banking Hub{user ? \`, \${user.name}\` : ''}</h1>
<TransactionErrorBoundary>
<Suspense fallback={<p>Loading banking modules…</p>}>
<Dashboard />
<Accounts />
<Transactions />
</Suspense>
</TransactionErrorBoundary>
</div>
);
}

export default App;
\`\`\`

Through components, props, state, effects, hooks, context, reducers, HOCs, render props, compound components, error boundaries, code splitting, routing, and performance hooks, Arjun’s Banking Finance App became the digital heart of DhanPur—balancing every ledger with precision and care.
`
}
]
},

{
category: 'react',
title: 'Healthcare App React',
subItems: [
{
question: 'How do I build a “Healthcare Hub” React app from scratch covering every core React concept, using an Indian storytelling format?',
answerMd: `
### The Healthcare Hub React App: An Indian Tale

In the bustling village of AarogyaPur, Dr. Kavya dreamed of a digital “Healthcare Hub” to serve every patient. Let’s walk with her through each lane of React, as she builds clinics, patient cards, and appointment counters.

---

#### 1. Laying the Foundation (create-react-app)
Dr. Kavya calls upon her module-maker:

\`\`\`bash
npx create-react-app healthcare-hub
cd healthcare-hub
npm start
\`\`\`

This scaffolds the main temple (\`public/index.html\`) and entry gate (\`src/index.js\`).

---

#### 2. Consultation Room: Functional Components
Each patient gets a card:

\`\`\`jsx
// src/components/PatientCard.jsx
import React from 'react';

function PatientCard({ name, age }) {
return (
<div className="patient-card">
<h3>{name}</h3>
<p>Age: {age}</p>
</div>
);
}

export default PatientCard;
\`\`\`

Props (\`name\`, \`age\`) are the patient’s details.

---

#### 3. Counting Appointments: useState
The receptionist tracks daily bookings:

\`\`\`jsx
import React, { useState } from 'react';

function AppointmentCounter() {
const [count, setCount] = useState(0);
return (
<div>
<p>Appointments booked: {count}</p>
<button onClick={() => setCount(c => c + 1)}>
Book Appointment
</button>
</div>
);
}
\`\`\`

State holds the appointment tally.

---

#### 4. Fetching Records: useEffect
Each morning, records arrive from the health server:

\`\`\`jsx
import React, { useState, useEffect } from 'react';

function MedicalRecords() {
const [records, setRecords] = useState([]);

useEffect(() => {
fetch('/api/records')
.then(r => r.json())
.then(setRecords);
}, []); // once at dawn

  return (
<ul>
{records.map(r => (
<li key={r.id}>{r.patientName}: {r.diagnosis}</li>
))}
</ul>
);
}
\`\`\`

\`useEffect\` is the daily records delivery.

---

#### 5. A Reusable Ritual: useFetch Hook
To fetch any resource:

\`\`\`jsx
// src/hooks/useFetch.js
import { useState, useEffect } from 'react';

export function useFetch(url) {
const [data, setData] = useState(null);
useEffect(() => {
fetch(url).then(r => r.json()).then(setData);
}, [url]);
return data;
}
\`\`\`

Now call \`const records = useFetch('/api/records')\` anywhere.

---

#### 6. Shared Clinic: Context API
A shared authentication context for staff:

\`\`\`jsx
// src/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
const [user, setUser] = useState(null);
return (
<AuthContext.Provider value={{ user, setUser }}>
{children}
</AuthContext.Provider>
);
}

export function useAuth() {
return useContext(AuthContext);
}
\`\`\`

Wrap at \`src/index.js\`:
\`<AuthProvider><App/></AuthProvider>\`.

---

#### 7. Managing Schedules: useReducer
The scheduler’s ledger grows complex:

\`\`\`js
// src/scheduleReducer.js
export function scheduleReducer(state, action) {
switch (action.type) {
case 'ADD':    return [...state, action.appointment];
case 'REMOVE': return state.filter(a => a.id !== action.id);
default:       return state;
}
}
\`\`\`

Use \`useReducer(scheduleReducer, [])\` to manage appointments.

---

#### 8. Loading Spinner: Higher-Order Component
Wrap heavy modules with a spinner:

\`\`\`jsx
function withSpinner(Component) {
return function Wrapped({ isLoading, ...props }) {
return isLoading
? <p>Loading…</p>
: <Component {...props} />;
};
}
\`\`\`

Use: \`const RecordsWithSpinner = withSpinner(MedicalRecords);\`

---

#### 9. Customizable Banner: Render Props
Display dynamic health alerts:

\`\`\`jsx
function AlertBox({ render }) {
const style = { border: '1px solid red', padding: '10px' };
return <div style={style}>{render()}</div>;
}

// Usage:
<AlertBox render={() => <p>Flu season alert!</p>} />
\`\`\`

---

#### 10. Clinic Tabs: Compound Components
To build “Patients” / “Appointments” tabs, share activeTab context among TabList, Tab, and TabPanel.

---

#### 11. Safety Net: Error Boundaries

\`\`\`jsx
class ErrorBoundary extends React.Component {
state = { hasError: false };
static getDerivedStateFromError() { return { hasError: true }; }
componentDidCatch(err) { console.error(err); }
render() {
return this.state.hasError
? <p>Component failed to load.</p>
: this.props.children;
}
}
\`\`\`

Wrap risky components, e.g. \`<ErrorBoundary><MedicalRecords/></ErrorBoundary>\`.

---

#### 12. Code Splitting: React.lazy & Suspense

\`\`\`jsx
const Patients = React.lazy(() => import('./Patients'));
const Appointments = React.lazy(() => import('./Appointments'));

function App() {
return (
<Suspense fallback={<p>Loading module…</p>}>
<Patients />
<Appointments />
</Suspense>
);
}
\`\`\`

---

#### 13. Navigating Wards: React Router

\`\`\`bash
npm install react-router-dom
\`\`\`

\`\`\`jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
return (
<BrowserRouter>
<nav>
<Link to="/">Home</Link>
<Link to="/patients">Patients</Link>
<Link to="/appointments">Appointments</Link>
</nav>
<Routes>
<Route path="/"               element={<Home />} />
<Route path="/patients"       element={<Patients />} />
<Route path="/appointments"   element={<Appointments />} />
</Routes>
</BrowserRouter>
);
}
\`\`\`

---

#### 14. Performance Tuning: useMemo & useCallback

\`\`\`jsx
const sortedPatients = useMemo(() => sortByName(patients), [patients]);
const handleBook = useCallback((id) => bookAppointment(id), []);
\`\`\`

---

#### 15. The Grand Opening: Bringing It All Together

\`\`\`jsx
// src/App.jsx
import React, { lazy, Suspense } from 'react';
import { useAuth } from './AuthContext';
import ErrorBoundary from './ErrorBoundary';

const Patients     = lazy(() => import('./Patients'));
const Appointments = lazy(() => import('./Appointments'));

function App() {
const { user } = useAuth();
return (
<div>
<h1>Welcome to Healthcare Hub{user ? \`, Dr. \${user.name}\` : ''}</h1>
<ErrorBoundary>
<Suspense fallback={<p>Loading content…</p>}>
<Patients />
<Appointments />
</Suspense>
</ErrorBoundary>
</div>
);
}

export default App;
\`\`\`

Through components, props, state, effects, hooks, context, reducers, HOCs, render props, compound components, error boundaries, code splitting, routing, and performance hooks, Dr. Kavya’s Healthcare Hub served every patient with seamless care—proving that React can heal and transform any village.
`
}
]
},

{
category: 'react',
title: 'Village Market React App',
subItems: [
{
question: 'How do I build a “Village Market” React app from scratch covering every core React concept, using an Indian storytelling format?',
answerMd: `
### The Village Market React App: An Indian Tale

Once upon a time in the dusty lanes of Reactpur, young Aanya set out to build a “Village Market” web app that would teach every core React concept. Let’s walk with her as she lays each brick and thatches every roof.

---

#### 1. Bootstrapping the Village
Aanya starts by calling the village architect:

\`\`\`bash
npx create-react-app village-market
cd village-market
npm start
\`\`\`

This scaffolds the map (\`public/index.html\`) and the main gate (\`src/index.js\`).

---

#### 2. Houses and Cottages: Functional Components
Each shop is a React component:

\`\`\`jsx
// src/components/Shop.jsx
import React from 'react';

function Shop({ name }) {
return <h2>Welcome to {name} Shop</h2>;
}

export default Shop;
\`\`\`

Props like \`name\` are the shop’s signboard.

---

#### 3. Inside the Shop: State with useState
To count mangoes sold:

\`\`\`jsx
import React, { useState } from 'react';

function MangoCounter() {
const [count, setCount] = useState(0);
return (
<div>
<p>Mangoes sold: {count}</p>
<button onClick={() => setCount(c => c + 1)}>
Sell one more
</button>
</div>
);
}
\`\`\`

\`useState\` is the shopkeeper’s ledger.

---

#### 4. Fetching Supplies: Side Effects with useEffect

\`\`\`jsx
import React, { useState, useEffect } from 'react';

function PriceBoard() {
const [price, setPrice] = useState(null);

useEffect(() => {
fetch('/api/mango-price')
.then(res => res.json())
.then(data => setPrice(data.price));
}, []); // run once at dawn

  return <p>Current price: ₹{price ?? 'loading…'}</p>;
}
\`\`\`

\`useEffect\` is the daily trip to the city market.

---

#### 5. A Custom Ritual: useFetch Hook
Aanya crafts a reusable data-fetching ritual:

\`\`\`jsx
// src/hooks/useFetch.js
import { useState, useEffect } from 'react';

export function useFetch(url) {
const [data, setData] = useState(null);
useEffect(() => {
fetch(url).then(r => r.json()).then(setData);
}, [url]);
return data;
}
\`\`\`

Now any shop calls \`const items = useFetch('/api/items')\`.

---

#### 6. The Village Council: Context API
A shared cart across shops:

\`\`\`jsx
// src/CartContext.js
import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
const [items, setItems] = useState([]);
return (
<CartContext.Provider value={{ items, setItems }}>
{children}
</CartContext.Provider>
);
}

export function useCart() {
return useContext(CartContext);
}
\`\`\`

Wrap \`<CartProvider><App/></CartProvider>\` in \`src/index.js\`.

---

#### 7. Complex Accounting: useReducer
When the ledger grows:

\`\`\`js
// src/cartReducer.js
export function cartReducer(state, action) {
switch (action.type) {
case 'ADD':    return [...state, action.item];
case 'REMOVE': return state.filter(i => i.id !== action.id);
default:       return state;
}
}
\`\`\`

In the provider use \`useReducer(cartReducer, [])\`.

---

#### 8. Decorating Shops: HOCs
Show a spinner around shops:

\`\`\`jsx
function withSpinner(Component) {
return function Wrapped({ isLoading, ...rest }) {
return isLoading
? <p>Loading shop…</p>
: <Component {...rest} />;
};
}
\`\`\`

Use: \`const ShopWithSpinner = withSpinner(Shop);\`

---

#### 9. Flexible Gifts: Render Props
Wrap any gift dynamically:

\`\`\`jsx
function GiftWrapper({ render }) {
const style = { border: '2px dotted green', padding: 10 };
return <div style={style}>{render()}</div>;
}

// Usage:
<GiftWrapper render={() => <p>Your mango gift pack!</p>} />
\`\`\`

---

#### 10. Seasonal Offers: Compound Components
Build a tab system with shared context—just like grouping villagers at a festival.

---

#### 11. Saving Honor: Error Boundaries

\`\`\`jsx
class ShopErrorBoundary extends React.Component {
state = { hasError: false };
static getDerivedStateFromError() { return { hasError: true }; }
componentDidCatch(err) { console.error(err); }
render() {
return this.state.hasError
? <p>Sorry, this shop is closed.</p>
: this.props.children;
}
}
\`\`\`

---

#### 12. Secret Scrolls: Code Splitting

\`\`\`jsx
const Shop = React.lazy(() => import('./Shop'));

function App() {
return (
<Suspense fallback={<p>Loading village…</p>}>
<Shop name="Mango" />
</Suspense>
);
}
\`\`\`

---

#### 13. Navigating Lanes: React Router
Stroll between Home, Market, Cart:

\`\`\`bash
npm install react-router-dom
\`\`\`

\`\`\`jsx
import {
BrowserRouter,
Routes,
Route,
Link
} from 'react-router-dom';

function App() {
return (
<BrowserRouter>
<nav>
<Link to="/">Home</Link>
<Link to="/market">Market</Link>
<Link to="/cart">Cart</Link>
</nav>
<Routes>
<Route path="/"      element={<Home />} />
<Route path="/market" element={<Market />} />
<Route path="/cart"   element={<Cart />} />
</Routes>
</BrowserRouter>
);
}
\`\`\`

---

#### 14. Spices & Performance: useMemo & useCallback

\`\`\`jsx
const expensiveValue = useMemo(() => computeBlend(items), [items]);
const handleClick    = useCallback(() => addToCart(item), [item]);
\`\`\`

---

#### 15. The Grand Feast: Bringing It All Together

\`\`\`jsx
// src/App.jsx
import React, { lazy, Suspense } from 'react';
import { useCart } from './CartContext';
import ShopErrorBoundary from './ShopErrorBoundary';

const Market = lazy(() => import('./Market'));
const Cart   = lazy(() => import('./Cart'));

function App() {
const { items } = useCart();
return (
<div>
<h1>Welcome to Village Market</h1>
<p>In cart: {items.length} items</p>
<ShopErrorBoundary>
<Suspense fallback={<p>Loading section…</p>}>
<Market />
<Cart />
</Suspense>
</ShopErrorBoundary>
</div>
);
}

export default App;
\`\`\`

Through functional and class components, props, state, effects, hooks, context, reducers, HOCs, render props, error boundaries, code splitting, routing, and performance optimizations, Aanya’s Village Market became the most vibrant bazaar in all the web lands.
`
}
]
},
{
category: 'react',
title: 'React Basic Concepts',
subItems: [
{
question: 'What is JSX and how does it work?',
answerMd: `
### What Is JSX?

\`\`\`mermaid
flowchart LR
JSX["JSX Code"] --> Babel["Babel / TypeScript Compiler"]
Babel --> JS["JavaScript"]
JS --> Browser["Browser Runtime"]
\`\`\`

JSX is a syntax extension that lets you write HTML-like code in JavaScript. Under the hood, Babel transforms JSX into \`React.createElement\` calls, which produce React elements.

\`\`\`jsx
// JSX
const element = <h1 className="title">Hello, world!</h1>;

// Transpiled JavaScript
const element = React.createElement(
'h1',
{ className: 'title' },
'Hello, world!'
);
\`\`\`
`
},
{
question: 'What is a React component, and how do you define one?',
answerMd: `
Imagine you’re building a house out of Lego. Each Lego brick is a small, self-contained piece that has its own shape and color. In React, a “component” is like one of those bricks—it’s a standalone building block of your UI.

- You define it by writing a JavaScript function or class that takes inputs (props) and returns a description of what it should look like (JSX).
- Just as you can snap bricks together to form walls or towers, you compose React components to form your complete app.
`
},
{
question: 'How do you create a functional component?',
answerMd: `
Think of a functional component as a Lego instruction card that just says “take these bricks (props) and snap them together this way (JSX).”

\`\`\`jsx
function Greeting({ name }) {
return <h1>Hello, {name}!</h1>;
}
export default Greeting;
\`\`\`

- Props are like the colors or shapes you choose on the instruction card.
- Hooks (useState, useEffect) are like little timers or sticky notes you attach to track state or side-jobs without changing the instructions themselves.
`
},
{
question: 'When and how would you use a class component?',
answerMd: `
A class component is like an elaborate, old-school factory machine with on/off switches, status lights, and maintenance callbacks. You use it when you need lifecycle hooks—points where you want the machine to:

- power up (\`componentDidMount\`)
- check safety pre-flight (\`shouldComponentUpdate\`)
- handle breakdowns (\`componentDidCatch\`)

\`\`\`jsx
class Counter extends React.Component {
state = { count: 0 };
increment = () => this.setState({ count: this.state.count + 1 });
render() {
return (
<div>
<p>{this.state.count}</p>
<button onClick={this.increment}>+1</button>
</div>
);
}
}
\`\`\`
`
},
{
question: 'What is the role of props and the `children` prop in composition?',
answerMd: `
Picture a gift box (the parent component) that you can customize with a ribbon color and gift tag (props). Inside the box you can drop any gift you like—chocolates, a toy car, or jewelry (children).

\`\`\`jsx
function Card({ title, children }) {
return (
<div className="card">
<h2>{title}</h2>
<div>{children}</div>
</div>
);
}
\`\`\`

- \`title\` is like the label on the box.
- \`children\` is whatever you choose to put inside—pure flexibility for nesting content.
`
},
{
question: 'How do Higher-Order Components (HOCs) share logic?',
answerMd: `
Imagine a gift-wrapping service: you hand them any gift (component) and they wrap it in fancy paper and ribbon (added behavior), then hand it back. That’s exactly what an HOC does.

\`\`\`jsx
function withLoading(WrappedComponent) {
return function Loader({ isLoading, ...props }) {
return isLoading
? <p>Loading…</p>
: <WrappedComponent {...props} />;
};
}
\`\`\`

- You never change the original gift—you just enhance it externally.
`
},
{
question: 'What are render props, and how do they work?',
answerMd: `
Think of a theme park ride where at the end you get a “design your own souvenir” token. The ride operator (parent component) passes you your ride stats (state) and you use that to craft your own souvenir (render function).

\`\`\`jsx
<MouseTracker render={({ x, y }) => (
<p>You moved to {x}, {y}</p>
)} />
\`\`\`

- The parent doesn’t know exactly what you’ll build, but it provides the raw data and you decide how to present it.
`
},
{
question: 'What are compound components, and when should you use them?',
answerMd: `
Imagine a restaurant: you have a Menu (Tabs), MenuItems (Tab buttons), and Dishes (TabPanels). They share the same table reservation (context) so when you pick a MenuItem, the right Dish shows up—no waiter (prop-drilling) needed.

\`\`\`jsx
<Tabs>
<TabList>
<Tab index={0}>Starters</Tab>
<Tab index={1}>Mains</Tab>
</TabList>
<TabPanels>
<div>Soup & Salad</div>
<div>Steak & Potatoes</div>
</TabPanels>
</Tabs>
\`\`\`

- They work as a group, sharing state invisibly via context—just like everyone at your table knows your reservation code.
`
},
{
question: 'How do you manage global or deeply nested state?',
answerMd: `
Picture a building’s central air-conditioning system (Context). Instead of running a tiny cooler in every room (passing props down dozens of levels), you wire each room to the central unit and just flip a switch (useContext).

\`\`\`jsx
const AuthContext = React.createContext();
function AuthProvider({ children }) {
const [user, setUser] = useState(null);
return (
<AuthContext.Provider value={{ user, setUser }}>
{children}
</AuthContext.Provider>
);
}
\`\`\`

- Any component can call \`useContext(AuthContext)\` and get the current “temperature” (user).
`
},
{
question: 'How can you visualize component composition?',
answerMd: `
Think of your UI as a skyscraper blueprint—each floor (component) contains rooms (sub-components), and rooms contain furniture (leaf components).

\`\`\`mermaid
graph TD
App --> Header
App --> Main
Main --> Sidebar
Main --> Content
Content --> WidgetA
Content --> WidgetB
\`\`\`
`
},
{
question: 'What are props and state in React?',
answerMd: `
### Props vs State

\`\`\`mermaid
flowchart LR
Parent["Parent"] --props--> Child["Child"]
Child --reads--> Display["Display Output"]

Child --calls setState--> StateChanged["Component Re-renders"]
\`\`\`

- **Props** are read-only inputs passed from parent to child.
- **State** is managed within a component and can change over time, triggering re-renders.

\`\`\`jsx
function Counter({ initial }) {
const [count, setCount] = useState(initial); // state

  return (
<div>
<p>Count: {count}</p>
<button onClick={() => setCount(count + 1)}>Increase</button>
</div>
);
}

// Usage
<Counter initial={0} />
\`\`\`
`
},
{
question: 'What is the Virtual DOM and how does reconciliation work?',
answerMd: `
### Virtual DOM & Reconciliation

\`\`\`mermaid
flowchart TD
Render1["Virtual DOM A"] -->|User Event| Render2["Virtual DOM B"]
Render1 -->|diff| Diff["Compute minimal changes"]
Diff --> Patch["Apply patches to Real DOM"]
\`\`\`

React keeps a lightweight copy of the DOM (Virtual DOM). On state or prop changes, it diffs old vs new Virtual DOM trees, computes the smallest set of updates, and patches the real DOM, optimizing performance.
`
},
{
question: 'What are React Hooks?',
answerMd: `
### Introduction to Hooks

Hooks are functions that let you “hook into” React features in functional components.

- **useState**: add local state
- **useEffect**: side effects and lifecycle
- **useContext**, **useReducer**, etc.

Hooks let you reuse stateful logic without classes.

\`\`\`jsx
import React, { useState, useEffect } from 'react';
\`\`\`
`
},
{
question: 'How do useState and useEffect work?',
answerMd: `
### useState & useEffect

\`\`\`mermaid
flowchart LR
Init["Initial Render"] --> useState1["useState Hook"]
useState1 --> Render["Render UI"]
Render --> useEffect1["useEffect Hook"]
useEffect1 -->|runs after paint| Effect["Perform side effect"]
\`\`\`

\`\`\`jsx
function Timer() {
const [seconds, setSeconds] = useState(0);

useEffect(() => {
const id = setInterval(() => setSeconds(s => s + 1), 1000);
return () => clearInterval(id); // cleanup on unmount
  }, []); // empty deps: run once

  return <div>Seconds: {seconds}</div>;
}
\`\`\`
`
},
{
question: 'How do you handle events in React?',
answerMd: `
### Event Handling

\`\`\`mermaid
flowchart LR
User["User Click"] -->|onClick| Button["<button>"]
Button --> Handler["handler function"]
Handler --> Update["State update"]
\`\`\`

React events use camelCase and receive a SyntheticEvent.

\`\`\`jsx
function Toggle() {
const [on, setOn] = useState(false);

function handleClick(e) {
console.log(e.target); // SyntheticEvent
    setOn(prev => !prev);
}

return (
<button onClick={handleClick}>
{on ? 'ON' : 'OFF'}
</button>
);
}
\`\`\`
`
},
{
question: 'What is conditional rendering in React?',
answerMd: `
### Conditional Rendering

\`\`\`mermaid
flowchart TB
State["state.show"] -->|true| A["<ComponentA />"]
State -->|false| B["<ComponentB />"]
\`\`\`

Render UI based on conditions using JavaScript expressions.

\`\`\`jsx
function Greeting({ isLoggedIn }) {
return (
<div>
{isLoggedIn ? <h1>Welcome back!</h1> : <h1>Please sign in.</h1>}
{isLoggedIn && <LogoutButton />}
</div>
);
}
\`\`\`
`
}
]
},// Add this as the next card in your src/qa-data.ts

{
category: 'react',
title: 'Context vs Redux for State Management',
subItems: [
{
question: 'What is React Context API and when to use it?',
answerMd: `
### React Context API

\`\`\`mermaid
flowchart LR
Provider["<ThemeContext.Provider>"]
Consumer["useContext(ThemeContext)"]
Provider --> Consumer
\`\`\`

Context lets you share values (theme, locale, auth) across the component tree without prop-drilling.

\`\`\`jsx
import React, { useContext } from 'react';

const ThemeContext = React.createContext('light');

function App() {
return (
<ThemeContext.Provider value="dark">
<Toolbar />
</ThemeContext.Provider>
);
}

function Toolbar() {
return <ThemedButton />;
}

function ThemedButton() {
const theme = useContext(ThemeContext);
return <button className={theme}>Current theme: {theme}</button>;
}
\`\`\`

Use Context for low-frequency updates and small slices of global data.
`
},
{
question: 'What is Redux and how does it work?',
answerMd: `
### Redux Architecture

\`\`\`mermaid
flowchart TD
Dispatch["dispatch(action)"] --> Store["Redux Store"]
Store --> Reducer["reducer(state, action)"]
Reducer --> State["new state"]
State --> Subscribers["UI updates via useSelector"]
\`\`\`

Redux centralizes state in a single immutable store.
- **Actions** describe “what happened.”
- **Reducers** compute new state.
- **Store** holds the state and dispatches updates.

\`\`\`jsx
import { createStore } from 'redux';

const initialState = { count: 0 };

function counterReducer(state = initialState, action) {
switch (action.type) {
case 'INCREMENT':
return { count: state.count + 1 };
default:
return state;
}
}

const store = createStore(counterReducer);

store.subscribe(() => console.log(store.getState()));
store.dispatch({ type: 'INCREMENT' }); // { count: 1 }
\`\`\`
`
},
{
question: 'How do you wire up Redux in a React app?',
answerMd: `
### Integrating Redux with React

\`\`\`mermaid
flowchart TD
Store["Redux Store"] --> Provider["<Provider store>"]
Provider --> App["<App />"]
App --> useSelector["useSelector()"]
App --> useDispatch["useDispatch()"]
\`\`\`

\`\`\`jsx
import React from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { createStore } from 'redux';

const store = createStore(counterReducer);

function Counter() {
const count = useSelector(state => state.count);
const dispatch = useDispatch();
return (
<div>
<p>{count}</p>
<button onClick={() => dispatch({ type: 'INCREMENT' })}>
+
</button>
</div>
);
}

function App() {
return <Counter />;
}

export default function Root() {
return (
<Provider store={store}>
<App />
</Provider>
);
}
\`\`\`
`
},
{
question: 'What are the key differences between Context API and Redux?',
answerMd: `
### Context vs Redux: Feature Comparison

| Aspect                | Context API                                         | Redux                                                          |
|-----------------------|-----------------------------------------------------|----------------------------------------------------------------|
| Data Source           | Multiple independent contexts                       | Single centralized store                                       |
| Updates Frequency     | Low to medium                                       | Can handle high-frequency updates                              |
| Boilerplate           | Minimal                                             | More setup (actions, reducers, middleware)                     |
| DevTools              | No built-in                                       | Redux DevTools for time-travel debugging                       |
| Ecosystem             | Built into React                                    | Rich middleware (Thunk, Saga), community plugins               |
| Performance Concerns  | Propagates to all consumers unless memoized         | Scoped updates via selectors, middleware for async flows       |

Use Context for simple, static data. Choose Redux for complex state logic, caching, or cross-cutting concerns.
`
},
{
question: 'How can you combine Context with useReducer as a lightweight alternative to Redux?',
answerMd: `
### Context + useReducer Pattern

\`\`\`mermaid
flowchart TB
Reducer["useReducer"] --> State["state, dispatch"]
State & Dispatch --> Provider["Context.Provider"]
Provider --> Consumers["useContext"]
\`\`\`

\`\`\`jsx
import React, { useReducer, useContext } from 'react';

const AuthContext = React.createContext();

const initialAuth = { user: null };

function authReducer(state, action) {
switch (action.type) {
case 'LOGIN':
return { user: action.payload };
case 'LOGOUT':
return { user: null };
default:
return state;
}
}

export function AuthProvider({ children }) {
const [state, dispatch] = useReducer(authReducer, initialAuth);
return (
<AuthContext.Provider value={{ state, dispatch }}>
{children}
</AuthContext.Provider>
);
}

export function useAuth() {
return useContext(AuthContext);
}
\`\`\`

This pattern gives you Redux-like reducers and dispatch, with zero extra dependencies.
`
},
{
question: 'When should you choose Context over Redux (and vice versa)?',
answerMd: `
### Choosing the Right Tool

- Use Context API when:
- You have a few global values (theme, locale, user).
- Updates are infrequent.
- You want minimal boilerplate.

- Use Redux when:
- Your app has complex, interconnected state.
- You need time-travel debugging or middleware.
- You handle high-frequency updates (e.g., real-time data).

Both can coexist—use Redux for core business logic and Context for UI concerns like theming.
`
}
]
},// Add this as the next card in your src/qa-data.ts

{
category: 'react',
title: 'React Router and Dynamic Routes',
subItems: [
{
question: 'How do you install and set up React Router?',
answerMd: `
### 1. Installation

\`\`\`bash
npm install react-router-dom
\`\`\`

### 2. Root Setup

\`\`\`jsx
// index.tsx or main.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.render(
<BrowserRouter>
<App />
</BrowserRouter>,
document.getElementById('root')
);
\`\`\`
`
},
{
question: 'How do you define and render basic routes?',
answerMd: `
### Defining Routes

\`\`\`mermaid
flowchart LR
BrowserRouter --> Routes
Routes --> RouteHome[/"path: \"/\" -> Home"/]
Routes --> RouteAbout[/"path: \"/about\" -> About"/]
\`\`\`

\`\`\`jsx
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';

function App() {
return (
<Routes>
<Route path="/" element={<Home />} />
<Route path="/about" element={<About />} />
</Routes>
);
}
\`\`\`
`
},
{
question: 'How do you create navigation links?',
answerMd: `
### Navigation with Links

\`\`\`mermaid
flowchart LR
Navbar --> LinkHome["<Link to='/'/> Home"]
Navbar --> LinkAbout["<Link to='/about'/> About"]
\`\`\`

\`\`\`jsx
import { Link } from 'react-router-dom';

function Navbar() {
return (
<nav>
<Link to="/">Home</Link>
<Link to="/about">About</Link>
</nav>
);
}
\`\`\`
`
},
{
question: 'What are dynamic routes and how do you define them?',
answerMd: `
### Dynamic Routes

\`\`\`mermaid
flowchart LR
Routes --> RouteUser[/"path: \"/users/:id\" -> UserProfile"/]
\`\`\`

\`\`\`jsx
// In App.tsx
<Routes>
<Route path="/users/:id" element={<UserProfile />} />
</Routes>
\`\`\`
`
},
{
question: 'How do you access URL parameters in a component?',
answerMd: `
### Accessing URL Params

\`\`\`jsx
import { useParams } from 'react-router-dom';

function UserProfile() {
const { id } = useParams();
// fetch user by id or display
  return <div>User Profile for ID: {id}</div>;
}
\`\`\`
`
},
{
question: 'How do you handle 404 Not Found pages?',
answerMd: `
### 404 Not Found

\`\`\`jsx
import NotFound from './NotFound';

<Routes>
{/* other routes */}
<Route path="*" element={<NotFound />} />
</Routes>
\`\`\`
`
},
{
question: 'How do you navigate programmatically?',
answerMd: `
### Programmatic Navigation

\`\`\`mermaid
flowchart LR
Component --> useNavigate["useNavigate() hook"]
useNavigate --> navigate["navigate('/path')"]
\`\`\`

\`\`\`jsx
import { useNavigate } from 'react-router-dom';

function Login() {
const navigate = useNavigate();

function onLoginSuccess() {
// after your logic, redirect
    navigate('/dashboard');
}

return <button onClick={onLoginSuccess}>Log In</button>;
}
\`\`\`
`
}
]
},// Add this as the next card in your src/qa-data.ts

{
category: 'react',
title: 'Best Practices for Custom Hooks and Performance Tuning',
subItems: [
{
question: 'What is a custom Hook and when should you create one?',
answerMd: `
### Defining Custom Hooks

\`\`\`mermaid
flowchart LR
ComponentA --> HookA["useCustomHook()"]
HookA --> Logic["shared logic"]
Logic --> State["useState / useEffect"]
\`\`\`

A custom Hook is a JavaScript function whose name starts with "use" and that can call other Hooks. Create one when:
- You have reusable stateful logic across components.
- You need to encapsulate side effects or subscriptions.
- You want to improve separation of concerns in your UI.
`
},
{
question: 'How should you name and structure your custom Hooks?',
answerMd: `
### Naming & Structure

1. Prefix with "use" so React can enforce the Rules of Hooks.
2. Keep parameters minimal and explicit.
3. Return a consistent API (array for ordering, object for named values).

\`\`\`jsx
// Good: clear signature and return shape
function useFetch(url) {
const [data, setData] = useState(null);
const [error, setError] = useState(null);

useEffect(() => {
fetch(url)
.then(res => res.json())
.then(setData)
.catch(setError);
}, [url]);

return { data, error };
}
\`\`\`
`
},
{
question: 'How do you manage dependencies and avoid stale closures?',
answerMd: `
### Dependency Management

\`\`\`mermaid
flowchart LR
useCallback --> deps["dependency array"]
StateChange --> Recreate["recreate callback"]
NoDeps --> Stale["stale variables"]
\`\`\`

- Always list every external variable in your dependency array.
- Use \`useCallback\` or \`useMemo\` when passing functions/objects to children.
- Prefer stable references (e.g., refs) for values you don’t want to re-trigger effects.
`
},
{
question: 'What are best practices for testing custom Hooks?',
answerMd: `
### Testing Custom Hooks

\`\`\`jsx
import { renderHook, act } from '@testing-library/react-hooks';

function useCounter(initial = 0) {
const [count, setCount] = useState(initial);
const increment = () => setCount(c => c + 1);
return { count, increment };
}

test('should increment counter', () => {
const { result } = renderHook(() => useCounter(5));

act(() => {
result.current.increment();
});

expect(result.current.count).toBe(6);
});
\`\`\`

- Use \`@testing-library/react-hooks\` for isolated hook tests.
- Wrap hook calls in \`act()\` for state updates.
- Mock external modules or APIs to avoid side effects.
`
},
{
question: 'How do you use useMemo and useCallback for performance tuning?',
answerMd: `
### Memoization with Hooks

\`\`\`mermaid
flowchart LR
Render1 --> useMemo["heavy computation"] --> Cache
Render2 --> useMemo["skipped if deps unchanged"]
\`\`\`

\`\`\`jsx
function ExpensiveList({ items }) {
const sorted = useMemo(() => {
// heavy sort
    return [...items].sort((a, b) => a.value - b.value);
}, [items]);

const handleClick = useCallback(id => {
console.log('clicked', id);
}, []);

return sorted.map(item => (
<div key={item.id} onClick={() => handleClick(item.id)}>
{item.name}
</div>
));
}
\`\`\`

- useMemo: cache expensive computations.
- useCallback: memoize functions passed to children.
`
},
{
question: 'When should you apply React.memo and component-level memoization?',
answerMd: `
### Component Memoization

\`\`\`mermaid
flowchart LR
Parent["Parent renders"] --> Cond["props unchanged?"]
Cond -- yes --> ChildMemo["skip re-render"]
Cond -- no --> Child["re-render child"]
\`\`\`

\`\`\`jsx
const Item = React.memo(function Item({ data, onSelect }) {
return <div onClick={() => onSelect(data.id)}>{data.name}</div>;
});
\`\`\`

- Wrap pure functional components in \`React.memo\` to skip renders when props are shallowly equal.
- Combine with \`useCallback\` to stabilize handler references.
`
},
{
question: 'How do you implement lazy loading and code splitting in React?',
answerMd: `
### Lazy Loading & Code Splitting

\`\`\`mermaid
flowchart LR
import --> ReactLazy["React.lazy()"]
Suspense["<Suspense>"] --> fallback["Loading..."]
LazyComponent --> Suspense
\`\`\`

\`\`\`jsx
import React, { Suspense, lazy } from 'react';

const Chart = lazy(() => import('./Chart'));

function Dashboard() {
return (
<Suspense fallback={<div>Loading chart...</div>}>
<Chart />
</Suspense>
);
}
\`\`\`

- Use \`React.lazy\` for dynamic imports of large modules.
- Wrap lazy components in \`<Suspense>\` with an appropriate fallback.
`
},
{
question: 'What tools and techniques can you use for profiling and tuning React performance?',
answerMd: `
### Profiling & Optimization Workflow

- Use React DevTools Profiler to record render timings and flame charts.
- Identify “costly” components by render duration and frequency.
- Apply memoization or split out heavy logic into web workers.
- Use virtualization libraries (react-window, react-virtualized) for long lists.
- Monitor bundle size with webpack-bundle-analyzer and trim unused code.
`
}
]
},// Add this as the next card in your src/qa-data.ts

{
category: 'react',
title: 'Integrating TypeScript end-to-end in your React codebase',
subItems: [
{
question: 'How do you set up a new React project with TypeScript?',
answerMd: `
### Bootstrapping a React+TypeScript App

\`\`\`bash
# Create React App
npx create-react-app my-app --template typescript

# Vite
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
\`\`\`

Both templates generate:
- .tsx entry files
- tsconfig.json with sensible defaults
- Type definitions for React and DOM
`
},
{
question: 'How do you configure tsconfig.json for React?',
answerMd: `
### Key tsconfig.json Settings

\`\`\`json
{
"compilerOptions": {
"target": "es6",
"jsx": "react-jsx",
"strict": true,
"moduleResolution": "node",
"esModuleInterop": true,
"skipLibCheck": true,
"forceConsistentCasingInFileNames": true,
"resolveJsonModule": true
},
"include": ["src"]
}
\`\`\`

- **jsx**: \`react-jsx\` enables the new JSX transform
- **strict**: turns on all strict type-checking options
- **resolveJsonModule**: import JSON files directly
`
},
{
question: 'How do you migrate existing .js/.jsx files to .ts/.tsx?',
answerMd: `
### Step-by-Step Migration

1. Rename \`.js/.jsx\` → \`.ts/.tsx\`.
2. Fix import errors:
\`\`\`ts
import Foo from './Foo'; // ensure Foo.tsx exists
   \`\`\`
3. Annotate missing types or add \`// @ts-ignore\` temporarily.
4. Replace \`propTypes\` with TypeScript interfaces/types.
5. Remove any runtime type checks once compile-time types pass.
`
},
{
question: 'How do you type component props and state?',
answerMd: `
### Typing Props & State

\`\`\`typescript
// Functional component with props
interface ButtonProps {
label: string;
disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, disabled = false }) => {
const [clicked, setClicked] = React.useState<boolean>(false);

return (
<button disabled={disabled} onClick={() => setClicked(true)}>
{clicked ? 'Clicked!' : label}
</button>
);
};
\`\`\`

- Define an interface or type alias for your props.
- Use \`React.FC<Props>\` or explicitly type the function signature.
- State hooks accept a generic for the state type.
`
},
{
question: 'How do you type hooks, refs, and events?',
answerMd: `
### Typing Hooks, Refs & Events

\`\`\`typescript
// useRef for a DOM node
const inputRef = React.useRef<HTMLInputElement | null>(null);

// useContext with a typed context
interface AuthContextType { user: string | null }
const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Event handler props
function TextInput() {
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
console.log(e.target.value);
};

return <input ref={inputRef} onChange={handleChange} />;
}
\`\`\`

- Pass generics to \`useRef<ElementType>\`.
- Create Contexts with a default typed value or \`undefined\`.
- Use React’s built–in event types like \`MouseEvent\` and \`ChangeEvent\`.
`
},
{
question: 'How do you declare module types for assets and CSS modules?',
answerMd: `
### Asset & CSS Module Declarations

\`\`\`typescript
// src/custom.d.ts
declare module '*.png';
declare module '*.svg' {
const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
export default ReactComponent;
}
declare module '*.module.css' {
const classes: { [key: string]: string };
export default classes;
}
\`\`\`

Add a \`custom.d.ts\` to let TS know how to import images, SVGs, and CSS modules.
`
},
{
question: 'How do you create generic components and custom hooks?',
answerMd: `
### Using Generics

\`\`\`typescript
// Generic List component
interface ListProps<T> {
items: T[];
renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
return <ul>{items.map((item, i) => <li key={i}>{renderItem(item)}</li>)}</ul>;
}

// Generic custom hook
function usePrevious<T>(value: T): T | undefined {
const ref = React.useRef<T>();
React.useEffect(() => {
ref.current = value;
}, [value]);
return ref.current;
}
\`\`\`

Generics let you write reusable, strongly-typed components and hooks.
`
},
{
question: 'How do you enforce linting, formatting, and type-checking?',
answerMd: `
### CI & Tooling Workflow

\`\`\`bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier
\`\`\`

.eslintrc.js
\`\`\`javascript
module.exports = {
parser: '@typescript-eslint/parser',
extends: [
'react-app',
'plugin:@typescript-eslint/recommended',
'prettier'
],
plugins: ['@typescript-eslint'],
rules: { /* your overrides */ }
};
\`\`\`

package.json scripts
\`\`\`json
{
"scripts": {
"lint": "eslint 'src/**/*.{ts,tsx}'",
"format": "prettier --write 'src/**/*.{ts,tsx,css}'",
"type-check": "tsc --noEmit"
}
}
\`\`\`

Integrate these into your CI pipeline to catch errors before merge.
`
}
]
},// Add these as the next cards in your src/qa-data.ts

{
category: 'javascript',
title: 'JavaScript Fundamental Concepts',
subItems: [
{
question: 'What are the differences between var, let, and const?',
answerMd: `
### var, let, const

\`\`\`mermaid
flowchart LR
Global["Global/Function Scope"]
Block["Block Scope"]
Global --> varVar["var declaration"]
Block --> letVar["let declaration"]
Block --> constVar["const declaration"]
\`\`\`

- var is function- or global-scoped and hoisted with an initial value of undefined.
- let and const are block-scoped and hoisted into a temporal dead zone until initialized.
- const creates a read-only binding; object contents can still change.

\`\`\`js
console.log(a, b); // undefined, ReferenceError
var a = 10;
let b = 20;
const c = 30;
\`\`\`
`
},
{
question: 'How do closures work in JavaScript?',
answerMd: `
### Closures

\`\`\`mermaid
flowchart TD
OuterFunc["outer() creates x"] --> InnerFunc["inner() closes over x"]
InnerFunc --> Access["inner() can access x even after outer() returns"]
\`\`\`

A closure is a function bundled with its lexical environment. Inner functions “remember” variables from their outer scope.

\`\`\`js
function outer() {
let count = 0;
return function inner() {
count++;
console.log(count);
};
}

const fn = outer();
fn(); // 1
fn(); // 2
\`\`\`
`
},
{
question: 'What is prototypical inheritance?',
answerMd: `
### Prototypal Inheritance

\`\`\`mermaid
flowchart LR
Obj1["obj1"] --> Proto["[[Prototype]]"] --> Obj2["obj2"]
\`\`\`

Objects inherit properties through a prototype chain. Each object has an internal link to its prototype.

\`\`\`js
const proto = { greet() { return 'hi'; } };
const obj = Object.create(proto);
console.log(obj.greet()); // 'hi'
\`\`\`
`
},
{
question: 'How does the JavaScript event loop work?',
answerMd: `
### Event Loop

\`\`\`mermaid
flowchart LR
CallStack["Call Stack"] -->|push function| Execute
WebAPIs["Web APIs"] --> CallbackQueue["Callback Queue"]
CallbackQueue -->|queue callbacks| EventLoop["Event Loop"]
EventLoop -->|drain when stack empty| CallStack
\`\`\`

JavaScript is single-threaded. Asynchronous callbacks wait in the task queue and run only when the call stack is empty.

\`\`\`js
setTimeout(() => console.log('task'), 0);
console.log('sync');
// Output: "sync" then "task"
\`\`\`
`
},
{
question: 'What are Promises and async/await?',
answerMd: `
### Promises & Async/Await

\`\`\`mermaid
flowchart TD
Promise["new Promise()"] --> then[".then()/.catch()"]
AsyncFunc["async function"] --> Await["await expression"]
Await --> Continue["pauses until resolved"]
\`\`\`

Promises represent future values. async/await is syntactic sugar over Promises for clearer async code.

\`\`\`js
function fetchData() {
return new Promise(res => setTimeout(() => res('data'), 1000));
}

async function logData() {
const result = await fetchData();
console.log(result);
}
\`\`\`
`
},
{
question: 'How do ES modules work?',
answerMd: `
### ES Modules

\`\`\`mermaid
flowchart LR
Exporting["export const x"] --> Importing["import { x } from './mod.js'"]
\`\`\`

ES modules let you split code into files. Imports are static and support tree-shaking.

\`\`\`js
// math.js
export function add(a, b) { return a + b; }

// app.js
import { add } from './math.js';
console.log(add(2, 3)); // 5
\`\`\`
`
}
]
},
{
category: 'javascript',
title: 'TypeScript Fundamental Concepts',
subItems: [
{
question: 'How does TypeScript type inference work?',
answerMd: `
### Type Inference

\`\`\`mermaid
flowchart LR
Declaration["let x = 5;"] --> TS["TypeScript infers x: number"]
\`\`\`

TypeScript automatically infers types from initial values and function return types. You only need annotations when inference falls short.

\`\`\`ts
let count = 10;       // inferred as number
const name = 'Alice'; // inferred as string

function square(n: number) {
return n * n;       // return type inferred as number
}
\`\`\`
`
},
{
question: 'What is the difference between interface and type?',
answerMd: `
### interface vs type

\`\`\`mermaid
flowchart LR
Interface["interface User { ... }"] --> Extend["can extend: interface Admin extends User"]
TypeAlias["type Point = { x: number }"] --> Union["can create unions/intersections"]
\`\`\`

- interface is extendable and mergeable; ideal for object shapes.
- type aliases are more flexible (unions, primitives, tuples) but cannot be reopened.

\`\`\`ts
interface User { id: number; name: string }
type ID = string | number;
\`\`\`
`
},
{
question: 'What are union and intersection types?',
answerMd: `
### Union & Intersection

\`\`\`mermaid
flowchart TD
A["A | B"] --> Value["value of A or B"]
A["A & B"] --> Combined["value must satisfy both A and B"]
\`\`\`

- Union (\`|\`) allows one of several types.
- Intersection (\`&\`) combines multiple types into one.

\`\`\`ts
type A = { x: number };
type B = { y: string };

let u: A | B = { x: 1 };
let i: A & B = { x: 1, y: 'ok' };
\`\`\`
`
},
{
question: 'How do generics work in TypeScript?',
answerMd: `
### Generics

\`\`\`mermaid
flowchart LR
Component["function identity<T>(arg: T)"] --> Return["returns T"]
\`\`\`

Generics allow you to write reusable components and functions that work with any type.

\`\`\`ts
function identity<T>(arg: T): T {
return arg;
}

const num = identity<number>(123);   // num: number
const str = identity('hello');       // str: string (inferred)
\`\`\`
`
},
{
question: 'What are utility types (e.g., Partial, Omit)?',
answerMd: `
### Utility Types

\`\`\`mermaid
flowchart LR
Partial["Partial<T>"] --> { all props optional }
Omit["Omit<T, K>"] --> { remove keys K from T }
\`\`\`

Built-in mapped types to transform existing types:

\`\`\`ts
interface Todo { id: number; title: string; completed: boolean }

type TodoPreview = Partial<Todo>;        // all props optional
type TodoWithoutID = Omit<Todo, 'id'>;   // remove id
\`\`\`
`
},
{
question: 'How do you implement type guards and narrowing?',
answerMd: `
### Type Guards & Narrowing

\`\`\`mermaid
flowchart LR
Value["unknown value"] --> Guard["if (typeof x === 'string')"] --> Narrow["x is string"]
\`\`\`

Use \`typeof\`, \`instanceof\`, or custom user-defined guards to inform the compiler of more specific types.

\`\`\`ts
function isString(x: unknown): x is string {
return typeof x === 'string';
}

function process(x: unknown) {
if (isString(x)) {
console.log(x.toUpperCase()); // safe
  }
}
\`\`\`
`
}
]
},// Add this as the next card in your src/qa-data.ts

{
category: 'cloud',
title: 'Spring Cloud Architecture & Microservices Patterns',
subItems: [
{
question: 'What is the Spring Cloud architecture for microservices?',
answerMd: `
### Spring Cloud Architecture for Microservices

\`\`\`mermaid
flowchart LR
Config["Config Server"] -->|serves config| ServiceA["Service A"]
Config --> ServiceB["Service B"]
Eureka["Service Registry (Eureka)"] --> ServiceA
Eureka --> ServiceB
Gateway["API Gateway"] --> Eureka
Gateway --> Clients["Clients"]
ServiceA --> CircuitBreaker["Resilience4j CircuitBreaker"]
ServiceB --> CircuitBreaker
ServiceA -->|publishes| Bus["Spring Cloud Bus"]
ServiceB --> Bus
\`\`\`

- Config Server centralizes configuration for all services.
- Service Registry (Eureka/Consul) enables dynamic discovery.
- API Gateway (Spring Cloud Gateway/Zuul) routes requests and applies filters.
- Circuit breakers, retries, and rate limiters provided via Resilience4j.
- Spring Cloud Bus propagates config changes over a message broker (RabbitMQ/Kafka).

\`\`\`java
// Config Server
@SpringBootApplication
@EnableConfigServer
public class ConfigServiceApplication { }

// Eureka Client & Config Client
@SpringBootApplication
@EnableEurekaClient
@EnableConfigClient
public class ServiceAApplication {
public static void main(String[] args) {
SpringApplication.run(ServiceAApplication.class, args);
}
}

// API Gateway routes definition
@Bean
public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
return builder.routes()
.route("service-a", r -> r.path("/a/**").uri("lb://SERVICE-A"))
.route("service-b", r -> r.path("/b/**").uri("lb://SERVICE-B"))
.build();
}
\`\`\`
`
},
{
question: 'What are the core microservices design patterns?',
answerMd: `
### Core Microservices Design Patterns

\`\`\`mermaid
flowchart LR
Client --> Gateway["API Gateway"]
Gateway --> Service1["Service 1"]
Gateway --> Service2["Service 2"]
Service1 --> DB1["Database 1"]
Service2 --> DB2["Database 2"]
SagaOrch["Saga Orchestrator"] --> Service1
SagaOrch --> Service2
\`\`\`

| Pattern            | Purpose                                              |
|--------------------|------------------------------------------------------|
| Service Discovery  | Dynamic registration and lookup of service instances |
| API Gateway        | Single entry point for routing, auth, and rate limit|
| Circuit Breaker    | Fail fast and prevent cascading failures             |
| Bulkhead           | Isolate resources to limit failure blast radius      |
| Retry & Fallback   | Automatic retries and graceful degradation           |
| Saga               | Manage distributed transactions                      |
| CQRS               | Separate read/write models for scalability           |
| Sidecar            | Package auxiliary features (logging, proxy) per service |

\`\`\`java
// Example: Saga orchestrator using Spring State Machine
@Configuration
public class OrderSagaConfig {
@Bean
public StateMachine<OrderState, OrderEvent> orderSagaMachine(
StateMachineFactory<OrderState, OrderEvent> factory) {
return factory.getStateMachine("order-saga");
}
}
\`\`\`
`
},
{
question: 'How do you implement rate limiting, retry, and fallback mechanisms?',
answerMd: `
### Rate Limiting, Retry & Fallback

\`\`\`mermaid
flowchart LR
Client -->|HTTP request| Gateway
Gateway -->|RateLimiter| Service
Service -->|Retry| ExternalAPI
ExternalAPI -->|failure| CircuitBreaker
CircuitBreaker --> Fallback["Fallback Method"]
\`\`\`

\`\`\`yaml
# application.yml
resilience4j:
retry:
instances:
backendService:
maxAttempts: 3
waitDuration: 500ms
ratelimiter:
instances:
gatewayLimit:
limitForPeriod: 10
limitRefreshPeriod: 1s
circuitbreaker:
instances:
backendService:
slidingWindowSize: 5
failureRateThreshold: 50
\`\`\`

\`\`\`java
@Service
public class MyService {
@Retry(name = "backendService")
@RateLimiter(name = "gatewayLimit")
@CircuitBreaker(name = "backendService", fallbackMethod = "fallback")
public String callExternalApi() {
return restTemplate.getForObject("http://external/api", String.class);
}

public String fallback(Exception ex) {
return "Default fallback response";
}
}
\`\`\`

- RateLimiter controls request throughput to protect downstream services.
- Retry automatically re-attempts failed calls before throwing an error.
- CircuitBreaker opens on repeated failures, routing calls to a fallback method.
`
}
]
},{
category: 'systemDesign',
title: 'URL Shortener/TinyURL - Stats Service Extension',
subItems: [
{
question: 'Extend URL Shortener/TinyURL with a Stats Service',
answerMd: `



### 1. New Functional Requirements
- Track **total clicks** and **unique visitors** per alias.
- Store **geolocation** and **user-agent** for insights.
- Offer a **stats API** without slowing down redirects.
- Support real-time dashboards.

### 2. API Additions
- GET /stats/{alias}
Response:
\`\`\`json
{
"clicks": 54321,
"uniqueVisitors": 42000,
"topCountries": [{ "country": "IN", "count": 30000 }],
"topBrowsers": [{ "browser": "Chrome", "count": 25000 }],
"lastAccessed": "2025-08-16T12:34:56Z"
}
\`\`\`

### 3. High-Level Architecture

\`\`\`mermaid
flowchart LR
Client -->|GET /{alias}| LB[Load Balancer];
LB --> Cache[(Redis Cache)];
Cache -- hit --> Redirect[302 Redirect];
Cache -- miss --> DB[(Primary DB)];
DB --> Cache;

%% Async analytics path
LB --> StatsQ[(Kafka/Queue)];
StatsQ --> StatsService[Stats Service];
StatsService --> StatsDB[(Analytics DB)];
\`\`\`

**Pattern:** Redirect path stays hot and minimal; stats capture is done asynchronously via a message queue.

### 4. Sequence Diagram

\`\`\`mermaid
sequenceDiagram
participant C as Client
participant LB as Load Balancer
participant Q as Kafka/Queue
participant S as Stats Service
participant ADB as Analytics DB

C->>LB: GET /{alias}
LB-->>C: 302 Redirect
LB->>Q: Publish click event { alias, ip, userAgent, ts }
Q->>S: Deliver event
S->>ADB: Insert/Update analytics
\`\`\`

### 5. Analytics Data Model

\`\`\`sql
CREATE TABLE click_events (
alias         VARCHAR(8),
click_time    TIMESTAMP,
ip_address    VARCHAR(45),
country_code  CHAR(2),
user_agent    TEXT
);

CREATE TABLE alias_stats (
alias          VARCHAR(8) PRIMARY KEY,
clicks         BIGINT,
unique_visitors BIGINT,
last_accessed  TIMESTAMP
);
\`\`\`

### 6. Caching & Scaling Considerations
- **Stats queries** can be served from a read-optimized store (e.g., Elasticsearch, ClickHouse).
- Aggregate periodically for speed; store raw events for drill-down.
- Partition events by alias for horizontal scale.

### 7. Availability & Fault Tolerance
- If Stats Service is down, redirects still succeed.
- Event queue buffers data during spikes/outages.
- Analytics DB can be eventually consistent.

### 8. Sample Java Snippet (Stats Capture)

\`\`\`java
public void handleRedirect(String alias, HttpServletRequest req) {
// 1. Redirect
  String url = lookupUrl(alias);
// send 302...

  // 2. Publish event
  ClickEvent evt = new ClickEvent(alias, Instant.now(),
req.getRemoteAddr(), geoIp(req.getRemoteAddr()), req.getHeader("User-Agent"));
statsQueue.publish(evt);
}
\`\`\`

---
This extension adds an **analytics sidecar** to your shortener: lightning-fast redirects on the main path, rich insights on a separate, scalable path.
`
}
]
}
];

export default data;